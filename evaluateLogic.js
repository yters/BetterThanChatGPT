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
  contradiction;
  tautology;
  runTime;
  constructor(contradiction, tautology) {
    this.contradiction = contradiction;
    this.tautology = tautology;
  }
}

function extractPartsAndEvaluateLogic() {
  let p1vn = document.getElementsByName("premise1VariableNegated")[0].checked;
  let p1vName = document.getElementsByName("premise1Variable")[0].value;
  let p1Struct = new Proposition(p1vn, p1vName);

  let r1an = document.getElementsByName("rule1AntecedentNegated")[0].checked;
  let r1aName = document.getElementsByName("rule1Antecedent")[0].value;
  let r1aStruct = new Proposition(r1an, r1aName);
  let r1acStruct = new Conjunction([r1aStruct]);

  let r1cn = document.getElementsByName("rule1ConsequentNegated")[0].checked;
  let r1cName = document.getElementsByName("rule1Consequent")[0].value;
  let r1cStruct = new Proposition(r1cn, r1cName);
  let r1cdStruct = new Disjunction([r1cStruct]);

  let r1Struct = new Conditional(r1acStruct, r1cdStruct);

  let cn = document.getElementsByName("conclusionNegated")[0].checked;
  let cName = document.getElementsByName("conclusion")[0].value;
  let cStruct = new Proposition(cn, cName);
    
  axiomsStruct = [
    p1Struct,
    r1Struct
  ];

  evaluateLogic(axiomsStruct, cStruct)
}

function initializeLogic(evaluation, axioms, conclusion) {
  evaluation.variables = [...new Set(axioms.map(l => l.variables()).concat(conclusion.variables()).flat())];
  evaluation.iterationsRemaining = 2**evaluation.variables.length;
  evaluation.axiomsLogicExpression = axioms.map(l => l.logicExpression()).join("&&")
  evaluation.logicExpression = "!(" + evaluation.axiomsLogicExpression + ")||(" + conclusion.logicExpression() + ")";
  return evaluation;
}

function evaluateLogicStep(evaluation, chunk) {
  startTime = performance.now();
  if (evaluation.iterationsRemaining <= 0) {
    evaluation.complete = true;
  } else {
    for (i = 0; i < chunk; i++, --evaluation.iterationsRemaining, ++evaluation.iterationsCompleted) {
      iTmp = evaluation.iterationsRemaining;
      for (let j = 0; j < evaluation.variables.length; j++) {
        varVal = iTmp % 2;
        this[evaluation.variables[j]] = varVal;
        iTmp = Math.floor(iTmp/2);
      }
      axiomsResult = eval(evaluation.axiomsLogicExpression);
      result = eval(evaluation.logicExpression);
      if (axiomsResult) {
        evaluation.contradiction = false;
      } 
      if (!result) {
        evaluation.tautology = false;
      }
      if (evaluation.iterationsRemaining == 0) {
        evaluation.complete = true;
        break;
      }
    }
  }
  evaluation.runTime += performance.now()-startTime;
  return evaluation;
}
