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
      .flat())
    ];

    if (conclusion) {
      this.variables.concat(conclusion.variables());
    }

    // Initialize logic expressions.
    this.axiomsLogicExpression = axioms.map(l => l.logicExpression()).join("&&")
    if (!conclusion) {
      this.logicExpression = "!(" + this.axiomsLogicExpression + ")||(" + this.axiomsLogicExpression + ")";
    } else {
      this.logicExpression = "!(" + this.axiomsLogicExpression + ")||(" + conclusion.logicExpression() + ")";
    }
  
    // Results report.
    this.complete = false;
    this.contradiction = true;
    this.tautology = true;

    // Step size.
    this.chunk = 100;

    // Completion countdown.
    this.iterationsRemaining = 2**this.variables.length;
    this.iterationsCompleted = 0;

    // Runtime stats.
    this.runTime = 0;
    this.startTime = performance.now();
  }


  /*
   * Evaluates a chunk of the truth table rows.
   * Uses binary decomposition of current iteration
   * to assign truth values to the variables.
   */
  evaluateLogicStep() {
    // Increment runtime counter.
    this.runTime += performance.now()-this.startTime;
    this.startTime = performance.now();

    // Evaluate a chunk of truth table rows.
    for (
      let i = 0; 
      i < this.chunk; 
      i++, 
      this.iterationsRemaining--, 
      this.iterationsCompleted++
    ) {

      /* 
       * Assign all variable truth values for row.
       *
       * Uses binary decomposition of current iteration.
       * Since iterations go from 0 to 2**variables.length-1,
       * all possible truth assignments are covered.
       */
      let iTmp = this.iterationsCompleted;
      for (let j = 0; j < this.variables.length; j++) {
        let varVal = iTmp % 2;
        window[this.variables[j]] = varVal;
        iTmp = Math.floor(iTmp/2);
      }

      // Evaluate the axioms to detect contradiction.
      let axiomsResult = eval(this.axiomsLogicExpression);

      if (axiomsResult) {
        this.contradiction = false;
      } 

      // Evaluate the complete argument to detect if 
      // conclusion doesn't follow from axioms.
      let result = eval(this.logicExpression);

      if (!result) {
        this.tautology = false;
      }

      // Stop evaluating if all truth table rows 
      // have been completed.
      if (this.iterationsRemaining == 0) {
        this.complete = true;
        break;
      }
    }
  }

  /*
   * Estimate how much longer truth table evaluation will take.
   */
  estimate() {
    let inverseSpeed = this.runTime / (this.iterationsCompleted+1);
    let remainingTime = inverseSpeed * this.iterationsRemaining;
    return remainingTime;
  }
}
