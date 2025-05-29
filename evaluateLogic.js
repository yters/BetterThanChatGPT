class Proposition {
  static number = 0;
  static name_map = {};
  static variable_map = {};
  negated;
  name;
  variable;
  constructor(negated, name) {
    this.negated = negated;
    this.name = name;
    if (Proposition.name_map[name]) {
      this.variable = Proposition.name_map[name];
    } else {
      this.variable = "P" + Proposition.number++;
      Proposition.name_map[name] = this.variable;
      Proposition.variable_map[this.variable] = name;
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
  let p1v_name = document.getElementsByName("premise1Variable")[0].value;
  let p1_struct = new Proposition(p1vn, p1v_name);

  let r1an = document.getElementsByName("rule1AntecedentNegated")[0].checked;
  let r1a_name = document.getElementsByName("rule1Antecedent")[0].value;
  let r1a_struct = new Proposition(r1an, r1a_name);
  let r1ac_struct = new Conjunction([r1a_struct]);

  let r1cn = document.getElementsByName("rule1ConsequentNegated")[0].checked;
  let r1c_name = document.getElementsByName("rule1Consequent")[0].value;
  let r1c_struct = new Proposition(r1cn, r1c_name);
  let r1cd_struct = new Disjunction([r1c_struct]);

  let r1_struct = new Conditional(r1ac_struct, r1cd_struct);

  let cn = document.getElementsByName("conclusionNegated")[0].checked;
  let c_name = document.getElementsByName("conclusion")[0].value;
  let c_struct = new Proposition(cn, c_name);
    
  axioms_struct = [
    p1_struct,
    r1_struct
  ];

  evaluateLogic(axioms_struct, c_struct)
}

function initializeLogic(evaluation, axioms, conclusion) {
  evaluation.variables = [...new Set(axioms.map(l => l.variables()).concat(conclusion.variables()).flat())];
  evaluation.iterations = 2**evaluation.variables.length;
  evaluation.axiomsLogicExpression = axioms.map(l => l.logicExpression()).join("&&")
  evaluation.logicExpression = "!(" + evaluation.axiomsLogicExpression + ")||(" + conclusion.logicExpression() + ")";
  return evaluation;
}

function evaluateLogicStep(evaluation, chunk) {
  startTime = performance.now();
  if (evaluation.iterations <= 0) {
    evaluation.complete = true;
  } else {
    for (i = 0; i < chunk; i++, --evaluation.iterations) {
      i_tmp = evaluation.iterations;
      for (let j = 0; j < evaluation.variables.length; j++) {
        var_val = i_tmp % 2;
        this[evaluation.variables[j]] = var_val;
        i_tmp = Math.floor(i_tmp/2);
      }
      axioms_result = eval(evaluation.axiomsLogicExpression);
      result = eval(evaluation.logicExpression);
      if (axioms_result) {
        evaluation.contradiction = false;
      } 
      if (!result) {
        evaluation.tautology = false;
      }
      if (evaluation.iterations == 0) {
        evaluation.complete = true;
        break;
      }
    }
  }
  evaluation.runTime += performance.now()-startTime;
  return evaluation;
}
