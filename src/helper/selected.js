export const selectedAll = (e, className = "item-list-check") => {
  if (e.target.checked) {
    const array = [];
    document.querySelectorAll(`.${className}`).forEach((elm) => {
      elm.checked = true;
      let _id = elm.value;
      array.push(_id);
    });
    return array;
  } else {
    document.querySelectorAll(".item-list-check").forEach((elm) => {
      elm.checked = false;
    });
    const array = [];
    return array;
  }
};

export const selectedOne = (e, className = "item-list-check") => {
  const elmClass = document.querySelectorAll(`.${className}`);
  if (e.target.value) {
    const array = [];
    elmClass.forEach((elm) => {
      if (elm.checked) {
        array.push(elm.value);
      }
    });
    return array;
  }
};

export const unselected = (
  id = "selected-all",
  className = "item-list-check"
) => {
  const elmClass = document.querySelectorAll(`.${className}`);
  document.querySelector(`#${id}`).checked = false;
  elmClass.forEach((elm) => {
    elm.checked = false;
  });
  const result = [];
  return result;
};
