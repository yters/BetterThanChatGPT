BigInt.prototype.toJSON = function () {
  return Number(this);
};

class Proposition {
  static pmap = {};
  static #whitespace_regex = /\s+/g;
  static #strip_regex = /IF|THEN|->|IMPLIES|THEREFORE|NOT|AND|OR|[{}]|&&+/g;
  static #first_bracket_regex = /^[^{}]*/;
  #name;
  results = {};
  mask = 0n;

  static newOrOld(name) {
    name = "{" + name + "}";
    if (Proposition.pmap[name]) {
      return Proposition.pmap[name];
    } else {
      return false;
    }
  }

  constructor(name) {
    name = "{" + name + "}"
    this.#name = name;
    Proposition.pmap[name] = this;
  }

  getName() {
    return this.#name;
  }

  static cleanName(name) {
    return name.replaceAll(Proposition.#strip_regex, ' ').replaceAll(Proposition.#whitespace_regex, ' ').trim();
  }

  static matchingBracket (i, str) {
    let count = 0;
    for (; i < str.length; i++) {
      let c = str.substr(i, 1);
      if (c == "}") {
        if (count == 0) {
          return i;
        } else {
          count--;
        }
      } else if (c == "{") {
        count++;
      }
    }
    return -1;
  }

  static breakout (str) {
    console.log("breakout: " + str);
    let out = [];
    let sub = str.match(Proposition.#first_bracket_regex)[0];
    out[0] = sub;
    let count = 1;
    for (let i = sub.length + 4; i < str.length; i += sub.length + 4) {
      let close = Proposition.matchingBracket(i, str);
      if (close == -1) {
        sub = str.slice(i);
      } else {
        sub = str.slice(i, close);
      }
      out[count++] = Proposition.breakout(sub);
    }
    return out;
  }

  static buildFrom (str) {
    console.log("buildfrom(" + typeof str + " " + JSON.stringify(str) + ")");
    let data = Proposition.breakout(str.slice(1, -1));
    return Proposition.buildFromBreakout(data);
  }

  static buildFromBreakout (data) {
    let name = data.shift();
    if (name === "NOT") {
      return new Negation(buildFromBreakout(data[0]));
    }
    if (name === "AND") {
      return new Conjuction(data.map(d => buildFromBreakout(d)));
    }
    if (name === "OR") {
      return new Disjunction(data.map(d => buildFromBreakout(d)));
    }
    if (name === "IMPLIES") {
      return new Conditional(Proposition.buildFromBreakout(data[0]), Proposition.buildFromBreakout(data[1]));
    }
    if (data.length > 0) {
      console.log("name: " + name + " data: " + JSON.stringify(data));
      let out = data.map(d => Proposition.buildFromBreakout(d));
      console.log("out: " + JSON.stringify(out));
      return out;
    }
    return new Claim(name);
  }
}



class Claim extends Proposition {
  static cmap = {};
  static imap = {};
  static index = 0n;
  
  constructor(name) {
    let cname = Proposition.cleanName(name);
    name = "{" + cname + "}" 
    if (Claim.cmap[name]) {
      return Claim.cmap[name];
    } else {
      super(cname);
      name = this.getName();
      Claim.cmap[name] = this;
      let i = Claim.index++;
      Claim.imap[name] = i;
      this.mask = 1n << BigInt(i);
      this.results[this.mask] = true;
      this.results[0n] = false;
    }
  }
}

class Negation extends Proposition {
  #proposition
  constructor(proposition) {
    let name = "NOT" + proposition.getName();
    let t = Proposition.newOrOld(name);
    if (t) return t;
    super(name);
    this.#proposition = proposition;
    this.mask = proposition.mask;
    Object.assign(this.results, proposition.results);
    for (const [i, v] of Object.entries(this.results)) {
      this.results[i] = !this.results[i];
    }
  }
}

function sortArrayByProperties(toSort, byObject) {
  let keys = Object.keys(byObject);
  return toSort.sort((a, b) => {
    return keys.indexOf(a) - keys.indexOf(b);
  });
}

function allBits (mask) {
  mask = BigInt(mask);
  let out = [];
  let count = 1n;
  while (mask != 0n) {
    let n = mask & 1n;
    if (n) {
      out.push(count);
    }
    mask >>= 1n;
    count <<= 1n;
  }
  return out;
}

function allCombinations (mask) {
  let bits = allBits(mask);
  //console.log("allBits:" + JSON.stringify(bits));
  let out = [0n];
  let sub = [];
  for (let i = 0; i < bits.length; i++) {
    sub.unshift(bits[i]);
    for (j = 1; j < sub.length; j++) {
      sub[j] |= bits[i];
    }
    out.push(...sub);
  }
  return out;
}

class Conjunction extends Proposition {
  #propositions;
  constructor(propositions) {
    let props = sortArrayByProperties(propositions, Proposition.pmap);
    let name = "AND" + props.map(prop => prop.getName()).join("&&");
    let t = Proposition.newOrOld(name);
    if (t) return t;
    super(name);
    this.#propositions = props;
    this.mask = this.#propositions.map(({mask}) => mask).reduce((accumulator, mask) => accumulator | mask);
    let rlist = allCombinations(this.mask);
    this.results = {};
    for (const r of rlist) {
      let raccumulation = this.#propositions[0].results[r & this.#propositions[0].mask];
      for (let i = 1; i < this.#propositions.length && raccumulation; i++) {
        raccumulation = this.#propositions[i].results[r & this.#propositions[i].mask];
      }
      this.results[r] = raccumulation;
    }
  }
}

class Disjunction extends Proposition {
  #propositions;
  constructor(propositions) {
    let props = sortArrayByProperties(propositions, Proposition.pmap);
    let name = "AND" + props.map(prop => prop.getName()).join("&&");
    let t = Proposition.newOrOld(name);
    if (t) return t;
    super(name);
    this.#propositions = props;
    this.mask = this.#propositions.map(({mask}) => mask).reduce((accumulator, mask) => accumulator | mask);
    let rlist = allCombinations(this.mask);
    this.results = {};
    for (const r of rlist) {
      let raccumulation = this.#propositions[0].results[r & this.#propositions[0].mask];
      for (let i = 1; i < this.#propositions.length && !raccumulation; i++) {
        raccumulation = this.#propositions[i].results[r & this.#propositions[i].mask];
      }
      this.results[r] = raccumulation;
    }
  }
}

class Conditional extends Proposition {
  #antecedent;
  #consequent;
  constructor(antecedent, consequent) {
    let name = "IMPLIES" + antecedent.getName() + "&&" + consequent.getName();
    let t = Proposition.newOrOld(name);
    if (t) return t;
    super(name);
    this.#antecedent = antecedent;
    this.#consequent = consequent;
    this.mask = this.#antecedent.mask | this.#consequent.mask;
    let rlist = allCombinations(this.mask);
    //console.log("rlist:" + JSON.stringify(rlist));
    this.results = {};
    for (const r of rlist) {
      this.results[r] = !this.#antecedent.results[r & this.#antecedent.mask] || this.#consequent.results[r & this.#consequent.mask];
    }
    /*console.log("antecedent:")
    console.log(JSON.stringify(this.#antecedent.results));
    console.log("consequent:" + this.#consequent.mask)
    console.log(JSON.stringify(this.#consequent.results));
    console.log(this.getName() + " : " + JSON.stringify(this.results));*/
  }
}

class Evaluation {
  contradiction;
  tautology;
  runTime;
  constructor(contradiction, tautology, runTime) {
    this.contradiction = contradiction;
    this.tautology = tautology;
    this.runTime = runTime;
  }
}

function evaluateLogic(axioms, conclusion) {
  let startTime = performance.now();
  if (axioms.length < 1) {
    return new Evaluation(true, true, performance.now() - startTime);
  }
  let axioms_logic = new Conjunction(axioms);
  let logic = new Disjunction([new Negation(axioms_logic), conclusion]);
  
  var contradiction = true;
  var tautology = true;

  let len = Object.keys(axioms_logic.results).length;
  for (let i = 0; i < len; i++) {
    if (axioms_logic.results[i]) {
      contradiction = false;
      break;
    }
  }

  len = Object.keys(logic.results).length;
  for (let i = 0; i < len; i++) {
    if (!logic.results[i]) {
      tautology = false;
      break;
    }
  }
  
  let evaluation = new Evaluation(contradiction, tautology, performance.now() - startTime);
  return evaluation;
}