class Proposition {
  static number = 0;
  static nameMap = {};
  static variableMap = {};
  negated;
  name;
  variable;
  constructor(negated, name) {
    this.negated = negated;
    this.name = name;
    if (Proposition.nameMap[name]) {
      this.variable = Proposition.nameMap[name];
    } else {
      this.variable = "P" + Proposition.number++;
      Proposition.nameMap[name] = this.variable;
      Proposition.variableMap[this.variable] = name;
    }
  }
  logicExpression() {
    if (this.negated) {
      return "!" + this.variable;
    } else {
      return this.variable;
    }
  }
  variables() {
    return [this.variable];
  }
}

class Conjunction {
  propositions;
  constructor(propositions) {
    this.propositions = propositions;
  }
  logicExpression() {
    return "(" + this.propositions.map(i => i.logicExpression()).join("&&") + ")";
  }
  variables() {
    return this.propositions.map(i => i.variables()).flat();
  }
}

class Disjunction {
  propositions;
  constructor(propositions) {
    this.propositions = propositions;
  }
  logicExpression() {
    return "(" + this.propositions.map(i => i.logicExpression()).join("||") + ")";
  }
  variables() {
    return this.propositions.map(i => i.variables()).flat();
  }
}

class Conditional {
  antecedent;
  consequent;
  constructor(antecedent, consequent) {
    this.antecedent = antecedent;
    this.consequent = consequent;
  }
  logicExpression() {
    return "(!(" + this.antecedent.logicExpression() + ")||(" + this.consequent.logicExpression() + "))"
  }
  variables() {
    return [this.antecedent.variables(), this.consequent.variables()].flat();
  }
}

class Evaluation {
  constructor(axioms, conclusion) {
    // Initialize variables.
    this.variables = [...new Set(
      axioms.map(l => l.variables())
      .concat(conclusion.variables())
      .flat())
    ];

    // Initialize logic expressions.
    this.axiomsLogicExpression = axioms.map(l => l.logicExpression()).join("&&")
    this.logicExpression = "!(" + this.axiomsLogicExpression + ")||(" + conclusion.logicExpression() + ")";
  
    // Results report.
    this.complete = false;
    this.contradiction = true;
    this.tautology = true;

    // Step size.
    this.chunk = 10;

    // Completion countdown.
    this.iterationsRemaining = 2**this.variables.length;
    this.iterationsCompleted = 0;

    // Runtime stats.
    this.runTime = 0;
  }

  evaluateLogicStep() {
    let startTime = performance.now();
    for (let i = 0; i < this.chunk; i++, this.iterationsRemaining--, this.iterationsCompleted++) {
      let iTmp = this.iterationsCompleted;
      for (let j = 0; j < this.variables.length; j++) {
        let varVal = iTmp % 2;
        window[this.variables[j]] = varVal;
        iTmp = Math.floor(iTmp/2);
      }
      let axiomsResult = eval(this.axiomsLogicExpression);
      let result = eval(this.logicExpression);
      if (axiomsResult) {
        this.contradiction = false;
      } 
      if (!result) {
        this.tautology = false;
      }
      if (this.iterationsRemaining == 0) {
        this.complete = true;
        break;
      }
    }
    this.runTime += performance.now()-startTime;
  }

  estimate() {
    return this.runTime / this.iterationsCompleted * this.iterationsRemaining;
  }
}
