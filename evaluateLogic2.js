class Proposition {
  static pmap = {};
  static const #whitespace = /\s+/g;
  static const #strip = /IF|THEN|->|IMPLIES|THEREFORE|NOT|AND|OR|[()]+/g;
  #name;
  refCount;
  constructor(name) {
    if (Proposition.pmap[tname]) {
      let out = Proposition.pmap[tname];
      out.refCount++;
      return out;
    } else {
      this.#name = tname;
      this.refCount = 1;
      Proposition.pmap[tname] = this;
    }
  }

  remove() {
    refCount--;
    if (refCount < 1) {
      delete Proposition.pmap[this.#name];
    }
  }

  getName() {
    return #name;
  }

  static cleanName(name) {
    return name.replace(strip, ' ').replace(whitespace, ' ').trim();
  }
}

class Claim : Proposition {
  static cmap = {};
  assume = true;
  constructor(name) {
    let tname = cleanName(name);
    super(tname);
    if (Claim.cmap[this.#name]) {
      return Claim.cmap[this.#name];
    } else {
      Claim.cmap[this.#name] = this;
    }
  }

  remove() {
    super.remove();
    if (refCount < 1) {
      delete Claim.cmap[this.#name];
   }
  }
}

class Negation : Proposition {
  #proposition
  constructor(proposition) {
    super("NOT " + proposition.getName());
    this.#proposition = proposition;
    proposition.refCount++;
  }

  remove() {
    super.remove();
    #proposition.remove;
    #proposition = null;
  }
}

function sortArrayByProperties(toSort, byObject) {
  return toSort.sort((a, b) => {
    return byObject.indexOf(a) - byObject.indexOf(b);
  });
}

class Conjunction : Proposition {
  #propositions;
  constructor(propositions) {
    let props = sortArrayByProperties(propositions, Proposition.pmap);
    let name = props.map(function(prop) { prop.}).join(" AND ");
    super(name);
    this.#propositions = props;
  }

  remove() {
    super.remove();
    #propositions.forEach(prop => prop.remove());
    #propositions = [];
  }
}

class Disjunction {
  #propositions;
  constructor(propositions) {
    let props = sortArrayByProperties(propositions, Proposition.pmap);
    let name = props.map(prop => prop.getName()).join(" OR ");
    super(name);
    this.#propositions = props;
  }

  remove() {
    super.remove();
    #propositions.forEach(prop => prop.remove());
    #propositions = [];
  }
}

class Conditional : Proposition {
  #antecedent;
  #consequent;
  constructor(antecedent, consequent) {
    super (antecedent.getName() + " IMPLIES " + consequent.getName());
    this.#antecedent = antecedent;
    this.#consequent = consequent;
  }
  
  remove() {
    super();
    #antecedent.remove();
    #antecedent = null;
    #consequent.remove();
    #consequent = null;
  }
}

class Evaluation {
  contradiction;
  tautology;
  runTime;
  constructor(contradiction, tautology) {
    this.contradiction = contradiction;
    this.tautology = tautology;
  }
}

function evaluateLogic2(axioms, conclusion) {
  let startTime = performance.now();
  
  Claim.cmap.forEach({assume} => assume = true;);
  
}

function evaluateLogic(axioms, conclusion) {
  let startTime = performance.now();
  var variables = [...new Set(axioms.map(l => l.variables()).concat(conclusion.variables()).flat())];
  console.log("variables: " + variables);
  var axioms_logic_expression = axioms.map(l => l.logicExpression()).join("&&")
  var logic_expression = "!(" + axioms_logic_expression + ")||(" + conclusion.logicExpression() + ")";
  console.log("logic expression: " + logic_expression);
  evaluation = evaluateLogicExpression(variables, axioms_logic_expression, logic_expression);
  var message = "contradiction: " + evaluation.contradiction + "\ntautology: " + evaluation.tautology + "\n";
  if (evaluation.contradiction) {
    message += "principle of explosion\n";
  }
  else if (evaluation.tautology) {
    message += "conclusion follows";
  }
  console.log(message);
  evaluation.runTime = performance.now() - startTime;
  return evaluation;
}

function evaluateLogicExpression(variables, axioms_logic_expression, logic_expression) {
  var contradiction = true;
  var tautology = true;
  iterations = 2**variables.length;
  console.log("iterations: " + iterations);
  for (let i = 0; i < iterations; i++) {
    console.log("i: " + i);
    i_tmp = i;
    for (let j = 0; j < variables.length; j++) {
      var_val = i_tmp % 2;
      this[variables[j]] = var_val;
      console.log(Proposition.variable_map[variables[j]] + " " + var_val);
      i_tmp = Math.floor(i_tmp/2);
    }
    axioms_result = eval(axioms_logic_expression)
    console.log("axioms result: " + axioms_result);
    result = eval(logic_expression);
    console.log("result: " + result);
    if (axioms_result) {
      contradiction = false;
    } 
    if (!result) {
      tautology = false;
    }
    console.log("===================");
  }
  return new Evaluation(contradiction, tautology)
}

