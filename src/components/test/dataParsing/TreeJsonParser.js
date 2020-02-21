function optionsTranslator(value) {
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
  
  function toDelete(index) {
    if (index === "expanded") return true;
    if (index === "isDirectory") return true;
    if (index === "title") return true;
    if (index === "parentKey") return true;
    if (index === "subtitle") return true;
  
    return false;
  }
  
  class TreeJsonParser {

   editConditionSlip = (count, input) => {
    if (Array.isArray(input)) {
      for (var index = input.length - 1; index >= 0; index--) {
        if (typeof input[index] == "object") {
          this.editConditionSlip(count, input[index]);
        }
        if (toDelete(index)) {
          input.splice(index, 1);
        }
      }
    } else {
      for (var jndex in input) {
        if (typeof input[jndex] == "object") {
          this.editConditionSlip(count, input[jndex]);
        }
        if (toDelete(jndex)) {
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
          input.action = optionsTranslator(input[jndex]);
        }
      }
    }
    return input;
  }
}

const facade = new TreeJsonParser();
export default facade;