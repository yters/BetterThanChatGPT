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
<<<<<<< Updated upstream
  runTime;
=======
>>>>>>> Stashed changes
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
  console.log("r1ac_struct propositions: " + r1ac_struct.propositions);

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
<<<<<<< Updated upstream
  evaluation.runTime = performance.now() - startTime;
=======
>>>>>>> Stashed changes
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

