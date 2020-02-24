function optionsDanishToEnglish(value) {
  switch (value) {
    case "lig med":
      value = "equals";
      break;
    case "større end":
      value = "greater than";
      break;
    case "mindre end":
      value = "less than";
      break;
    default:
      value = "";
  }
  return value;
}

function optionsEnglishToDanish(value) {
  switch (value) {
    case "equals":
      value = "lig med";
      break;
    case "greater than":
      value = "større end";
      break;
    case "less than":
      value = "mindre end";
      break;
    default:
      value = "";
  }
  return value;
}

function toDeleteTreeToRoutingSlip(index) {
  if (index === "expanded") return true;
  if (index === "isDirectory") return true;
  if (index === "parentKey") return true;
  if (index === "subtitle") return true;

  return false;
}

function toDeleteRoutingSlipToTree(index) {
  if (index === "priority") return true;

  return false;
}

class TreeJsonParser {
  treeToRoutingSlip = (count, input) => {
    if (Array.isArray(input)) {
      for (var index = input.length - 1; index >= 0; index--) {
        if (typeof input[index] == "object") {
          this.treeToRoutingSlip(count, input[index]);
        }
        if (toDeleteTreeToRoutingSlip(index)) {
          input.splice(index, 1);
        }
      }
    } else {
      for (var jndex in input) {
        if (typeof input[jndex] == "object") {
          this.treeToRoutingSlip(count, input[jndex]);
        }
        if (toDeleteTreeToRoutingSlip(jndex)) {
          delete input[jndex];
        }
        if (jndex === "title") {
          input.topic = input[jndex];
          delete input[jndex];
        }
        if (jndex === "conditions") {
          input.priority = count;
          count++;
        }
        if (jndex === "children") {
          input.routes = input[jndex];
          delete input[jndex];
        }
        if (jndex === "action") {
          input.action = optionsDanishToEnglish(input[jndex]);
        }
      }
    }
    return input;
  };

  routingSlipToTree = input => {
    if (Array.isArray(input)) {
      for (var index = input.length - 1; index >= 0; index--) {
        if (typeof input[index] == "object") {
          this.routingSlipToTree(input[index]);
        }
        if (toDeleteRoutingSlipToTree(index)) {
          input.splice(index, 1);
        }
      }
    } else {
      for (var jndex in input) {
        if (typeof input[jndex] == "object") {
          this.routingSlipToTree(input[jndex]);
        }
        if (toDeleteRoutingSlipToTree(jndex)) {
          delete input[jndex];
        }
        if (jndex === "conditions") {
          input.subtitle = `${input[jndex][0].field} - ${input[jndex][0].action} - ${input[jndex][0].value}`;
          input.expanded = true;
          input.isDirectory = true;
        }
        if (jndex === "routes") {
          input.children = input[jndex];
          delete input[jndex];
        }
        if (jndex === "topic") {
          input.title = input[jndex];
          delete input[jndex];
        }
        if (jndex === "action") {
          input.action = optionsEnglishToDanish(input[jndex]);
        }
      }
    }
    return input;
  };
}

const facade = new TreeJsonParser();
export default facade;
