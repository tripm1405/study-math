function obj2FormData(formData, valueCurrent, keyCurrent) {
  const ObjType = typeof({});

  if (typeof(valueCurrent) === ObjType) {
    for (const key in valueCurrent) {
      obj2FormData(formData, valueCurrent[key], keyCurrent ? `${keyCurrent}[${key}]` : key);
    }
    return;
  }

  formData.set(keyCurrent, valueCurrent);
}