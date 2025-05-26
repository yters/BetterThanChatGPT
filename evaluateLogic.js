class Premise {
  negated;
  name;
  constructor(negated, name) {
    this.negated = negated;
    this.name = name;
  }
  logicExpression() {
    if (this.negated) {
      return "!" + this.name;
    } else {
      return this.name;
    }
  }
  variables() {
    return [this.name];
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
    return [this.antecedent.name, this.consequent.name];
  }
}

class Conclusion {
  negated;
  name;
  constructor(negated, name) {
    this.negated = negated;
    this.name = name;
  }
  logicExpression() {
    if (this.negated) {
      return "!" + this.name;
    } else {
      return this.name;
    }
  }
  variables() {
    return [this.name];
  }
}

function extractPartsAndEvaluateLogic() {
  let p1vn = document.getElementsByName("premise1VariableNegated")[0].checked;
  let p1v_name = document.getElementsByName("premise1Variable")[0].value;
  let p1_struct = new Premise(p1vn, p1v_name);
  let r1an = document.getElementsByName("rule1AntecedentNegated")[0].checked;
  let r1a_name = document.getElementsByName("rule1Antecedent")[0].value;
  let r1a_struct = new Premise(r1an, r1a_name);
  let r1cn = document.getElementsByName("rule1ConsequentNegated")[0].checked;
  let r1c_name = document.getElementsByName("rule1Consequent")[0].value;
  let r1c_struct = new Premise(r1cn, r1c_name);
  let r1_struct = new Conditional(r1a_struct, r1c_struct);
  let cn = document.getElementsByName("conclusionNegated")[0].checked;
  let c_name = document.getElementsByName("conclusion")[0].value;
  let c_struct = new Conclusion(cn, c_name);
    
  argument_struct = [
    p1_struct,
    r1_struct,
    c_struct
  ];

  variables = [...new Set(argument_struct.map(l => l.variables()).flat())];
  console.log("variables: " + variables);
  logic_expression = argument_struct.map(l => l.logicExpression()).join("&&");
  console.log("logic expression: " + logic_expression);
  evaluateLogic(variables, logic_expression);
}

function evaluateLogic(variables, logic_expression) {
  contradiction = true;
  tautology = true;
  for (let i = 0; i < 2^variables.length; i++) {
    i_tmp = i;
    for (let j = 0; j < variables.length; j++) {
      this[variables[i]] = i_tmp % 2;
      i_tmp = Math.floor(i_tmp/2);
    }
    if (eval(logic_expression)) {
      contradiction = false;
    } else {
      tautology = false;
    }
  }
  message = "contradiction: " + contradiction + "\ntautology: " + tautology "\n";
  if (tautology) {
    message += "conclusion follows";
  }
  alert(message)
}

