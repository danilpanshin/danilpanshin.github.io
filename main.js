'use strict';

//Window DOMLoad Listener
window.addEventListener('DOMContentLoaded', function () {

  function setGuidAndUid() {

    var urlQuery = window.utils.parseUrlQuery();

    if (urlQuery.guid) {
      window.xhr.surveyConfig.data.guid = urlQuery.guid;
      window.xhr.guid = urlQuery.guid;
    }

    if (urlQuery.uid) {
      window.xhr.surveyConfig.data.uid = urlQuery.uid;
      window.xhr.uid = urlQuery.uid;
    }
  }

  function checkGuid() {
    if (window.xhr.guid) {
      window.xhr.create(window.xhr.surveyConfig);
    } else {
      window.error.createIfNoGuid();
    }
  }

  setGuidAndUid();
  checkGuid();
});

// Array from polyfill
; (function () {
  if (!Array.from) {
    Array.from = (function () {
      var toStr = Object.prototype.toString;
      var isCallable = function (fn) {
        return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
      };
      var toInteger = function (value) {
        var number = Number(value);
        if (isNaN(number)) { return 0; }
        if (number === 0 || !isFinite(number)) { return number; }
        return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
      };
      var maxSafeInteger = Math.pow(2, 53) - 1;
      var toLength = function (value) {
        var len = toInteger(value);
        return Math.min(Math.max(len, 0), maxSafeInteger);
      };

      // The length property of the from method is 1.
      return function from(arrayLike/*, mapFn, thisArg */) {
        // 1. Let C be the this value.
        var C = this;

        // 2. Let items be ToObject(arrayLike).
        var items = Object(arrayLike);

        // 3. ReturnIfAbrupt(items).
        if (arrayLike == null) {
          throw new TypeError('Array.from requires an array-like object - not null or undefined');
        }

        // 4. If mapfn is undefined, then let mapping be false.
        var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
        var T;
        if (typeof mapFn !== 'undefined') {
          // 5. else
          // 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
          if (!isCallable(mapFn)) {
            throw new TypeError('Array.from: when provided, the second argument must be a function');
          }

          // 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
          if (arguments.length > 2) {
            T = arguments[2];
          }
        }

        // 10. Let lenValue be Get(items, "length").
        // 11. Let len be ToLength(lenValue).
        var len = toLength(items.length);

        // 13. If IsConstructor(C) is true, then
        // 13. a. Let A be the result of calling the [[Construct]] internal method 
        // of C with an argument list containing the single item len.
        // 14. a. Else, Let A be ArrayCreate(len).
        var A = isCallable(C) ? Object(new C(len)) : new Array(len);

        // 16. Let k be 0.
        var k = 0;
        // 17. Repeat, while k < len… (also steps a - h)
        var kValue;
        while (k < len) {
          kValue = items[k];
          if (mapFn) {
            A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
          } else {
            A[k] = kValue;
          }
          k += 1;
        }
        // 18. Let putStatus be Put(A, "length", len, true).
        A.length = len;
        // 20. Return A.
        return A;
      };
    }());
  }
})();

// Array find polyfill
; (function () {
  if (!Array.prototype.find) {
    Object.defineProperty(Array.prototype, 'find', {
      value: function (predicate) {
        // 1. Let O be ? ToObject(this value).
        if (this == null) {
          throw TypeError('"this" is null or not defined');
        }

        var o = Object(this);

        // 2. Let len be ? ToLength(? Get(O, "length")).
        var len = o.length >>> 0;

        // 3. If IsCallable(predicate) is false, throw a TypeError exception.
        if (typeof predicate !== 'function') {
          throw TypeError('predicate must be a function');
        }

        // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
        var thisArg = arguments[1];

        // 5. Let k be 0.
        var k = 0;

        // 6. Repeat, while k < len
        while (k < len) {
          // a. Let Pk be ! ToString(k).
          // b. Let kValue be ? Get(O, Pk).
          // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
          // d. If testResult is true, return kValue.
          var kValue = o[k];
          if (predicate.call(thisArg, kValue, k, o)) {
            return kValue;
          }
          // e. Increase k by 1.
          k++;
        }

        // 7. Return undefined.
        return undefined;
      },
      configurable: true,
      writable: true
    });
  }
})();

//utils
; (function () {

  var className = {
    VISIBLE: 'visible'
  };

  function renameParametrs(item) {
    renameKey(item, 'Questions', 'Surveys');
    renameKey(item, 'HeaderText', 'Description');
    renameKey(item, 'HeaderPictureLink', 'KeyvisualLink');
    renameKey(item, 'FirstQuestionNo', 'FirstSurveyNo');
    renameKey(item, 'QuestionNo', 'SurveyNo');
    renameKey(item, 'QuestionType', 'SurveyType');
    renameKey(item, 'NextQuestionNo', 'NextSurveyNo');
    renameKey(item, 'QuestionGroupCode', 'SurveyGroup');

    return item;
  }

  function renameKey(object, oldKey, newKey) {
    if (object[oldKey] || object[oldKey] === '') {
      object[newKey] = object[oldKey];
      delete object[oldKey];

      return object;
    }
  }

  function showElement(element) {
    if (element) {
      element.classList.add(className.VISIBLE);
    }
  }

  function hideElement(element) {
    if (element) {
      element.classList.remove(className.VISIBLE);
    }
  }

  function removeElementChildren(element) {
    while (element.children.length > 0) {
      element.children[0].remove();
    }
  }

  function parseUrlQuery() {
    var data = {};
    if (location.search) {
      var pair = (location.search.slice(1)).split('&');
      for (var i = 0; i < pair.length; i++) {
        var param = pair[i].split('=');
        data[param[0]] = param[1];
      }
    }
    return data;
  }

  function slowScrollToElement(element) {
    var topPageOffset = window.pageYOffset;
    var topClientOffset = element.getBoundingClientRect().top;
    var velocity = 1;
    var start = null;

    function animateStep(time) {
      if (start === null) {
        start = time;
      }

      var progress = time - start;
      var position = (topClientOffset < 0 ? Math.max(topPageOffset - progress / velocity, topPageOffset + topClientOffset) : Math.min(topPageOffset + progress / velocity, topPageOffset + topClientOffset));

      window.scrollTo(0, position);
      if (position != topPageOffset + topClientOffset) {
        requestAnimationFrame(animateStep);
      }
    }

    requestAnimationFrame(animateStep);
  }

  function changeKeyAndValueInObject(object) {
    var reversedObject = {};
    for (var key in object) {
      if (object.hasOwnProperty(key)) {
        reversedObject[object[key]] = key;
      }
    }

    return reversedObject;
  }

  function getTrueKeyInObject(object) {
    for (var key in object) {
      if (object.hasOwnProperty(key) && object[key]) {
        return key;
      }
    }
  }

  window.utils = {
    class: className,
    renameParametrs: renameParametrs,
    showElement: showElement,
    hideElement: hideElement,
    removeChildren: removeElementChildren,
    slowScrollToElement: slowScrollToElement,
    changeKeyAndValueInObject: changeKeyAndValueInObject,
    getTrueKeyInObject: getTrueKeyInObject,
    parseUrlQuery: parseUrlQuery
  }
})();

//config 
; (function () {

  var questionnaire = {
    ID: 'questionnaire',
  };

  var nameToCode = {
    text: 'T',
    rating: 'R',
    select: 'S',
    multiSelect: 'M',
    checkbox: 'H',
    caption: 'C',
    selectTable: 'ST',
    selectHorizontal: 'SH'
  };

  var codeToName = window.utils.changeKeyAndValueInObject(nameToCode);

  var surveyGroup = {
    CLASS: 'survey-group',
    TAG: 'div',
    text: {
      CLASS: 'survey-group-name',
      TAG: 'p',
    }
  };

  var survey = {
    CLASS: 'survey',
    TAG: 'div',
  };

  var question = {
    CLASS: 'question',
    TAG: 'div',
    hint: {
      CLASS: 'question-hint',
      TAG: 'p',
    },
    wrapper: {
      TAG: 'div',
      CLASS: 'question-wrapper',
    }
  };

  var answerGroup = {
    CLASS: 'answer-group',
    TAG: 'div',
    name: {
      CLASS: 'answer-group-name',
      TAG: 'p',
    },
    wrapper: {
      CLASS: 'answer-group-wrapper',
      TAG: 'div',
    }
  };

  var answer = {
    OLD_ANSWER_NO_LENGTH: 2,
    DELIMITER: '_',
    ONE_ANSWER_NO: '_01',
    comment: {
      CODE: 'C',
      CLASS: 'answer-comment',
      ID_PART: '-comment',
      PLACEHOLDER: '',
      TAG: 'textarea',
      wrapper: {
        CLASS: 'answer-comment-wrapper',
        TAG: 'div'
      }
    },
    hint: {
      CLASS: 'answer-hint',
      TAG: 'p',
      key: {
        TEXT: 'AnswerHint',
      }
    },
    label: {
      TAB_INDEX: '0',
      TAG: 'label',
    },
    wrapper: {
      CLASS: 'answers',
      TAG: 'div',
    },
    text: {
      CLASS: 'input-text',
      CODE: 'T',
      PLACEHOLDER: '',
      TAG: 'textarea',
      create: 'createOneAnswerElement',
      wrapper: {
        CLASS: 'text-answer-wrapper'
      }
    },
    caption: {
      CLASS: 'caption',
      CODE: 'C',
      TAG: 'p',
      create: 'createOneAnswerElement',
      wrapper: {
        CLASS: 'caption-wrapper'
      }
    },
    select: {
      CLASS: 'input-select',
      CODE: 'S',
      TAG: 'input',
      TYPE: 'radio',
      create: 'createSomeAnswersElements',
      wrapper: {
        CLASS: 'select-answers-wrapper',
      }
    },
    rating: {
      CLASS: 'input-rating',
      CODE: 'R',
      LABEL_TEXT: '',
      TAG: 'input',
      TYPE: 'radio',
      create: 'createSomeAnswersElements',
      wrapper: {
        CLASS: 'rating-answers-wrapper'
      }
    },
    checkbox: {
      CLASS: 'input-checkbox',
      CODE: 'H',
      TAG: 'input',
      TYPE: 'checkbox',
      create: 'createOneAnswerElement',
      wrapper: {
        CLASS: 'checkbox-answer-wrapper'
      }
    },
    multiSelect: {
      CLASS: 'input-checkbox',
      CODE: 'M',
      TAG: 'input',
      TYPE: 'checkbox',
      create: 'createSomeAnswersElements',
      wrapper: {
        CLASS: 'checkbox-answers-wrapper',
      },
    },
    selectHorizontal: {
      CLASS: 'input-select',
      CODE: 'SH',
      TAG: 'input',
      TYPE: 'radio',
      create: 'createSomeAnswersElements',
      wrapper: {
        CLASS: 'select-horizontal-answers-wrapper',
      }
    },
  };

  var progress = {
    wrapperElement: {
      CLASS: 'progress-wrapper',
      TAG: 'div',
    },
    element: {
      CLASS: 'progress',
      ID: 'progress',
      TAG: 'progress',
      START_VALUE: 1,
      INCREASE: 1,
    },
    outputElement: {
      TAG: 'span',
      CLASS: 'output',
      SLASH: '/'
    }
  };

  var button = {
    TAG: 'button',
    next: {
      CLASS: 'next-button',
      ID: 'next-button',
      TEXT: 'Далее'
    },
    back: {
      CLASS: 'back-button',
      ID: 'back-button',
      TEXT: 'Назад'
    },
    wrapper: {
      CLASS: 'buttons-wrapper',
      TAG: 'div',
    }
  };

  var keyvisual = {
    TAG: 'img',
    CLASS: 'keyvisual',
  };

  var error = {
    CLASS: 'error',
    TAG: 'div',
    header: {
      TAG: 'h2',
    },
    isTooShort: {
      TEXT: 'Введите больше символов. Введено $, минимум ~',
      getValueFromCache: function (entity) {
        return entity.MessageMinLength;
      }
    },
    isTooFew: {
      TEXT: 'Отметьте больше вариaнтов. Отмечено $, минимум ~',
      getValueFromCache: function (entity) {
        return entity.MessageMinLength;
      }
    },
    isTooMany: {
      TEXT: 'Отметьте меньше вариaнтов. Отмечено $, максимум &',
      getValueFromCache: function (entity) {
        return entity.MessageMaxLength;
      }
    },
    isNotMatchWithRegexpAndManadatory: {
      TEXT: 'Введенный текст не совпадает с требуемым форматом данных',
      getValueFromCache: function (entity) {
        return entity.MessageRegexp;
      }
    },
    isNotMatchWithRegexpAndNotMandatory: {
      TEXT: 'Введенный текст не совпадает с требуемым форматом данных. Удалите текст или введите в правильном формате',
      getValueFromCache: function (entity) {
        return entity.MessageRegexp;
      }
    },
    isFailure: {
      TEXT: 'Не удалось сохранить результат. Пожалуйста, попробуйте нажать кнопку еще раз позже',
    },
    isNoGuid: {
      HEADER_TEXT: 'Эта ссылка более недоступна',
      TEXT: 'К сожалению, пройти этот опрос более невозможно',
    },
    isNoData: {
      HEADER_TEXT: 'Не удалось загрузить опрос',
      TEXT: 'Пожалуйста, попробуйте открыть эту страницу еще раз позже',
    },
    symbolToValue: {
      '$': 'current',
      '~': 'min',
      '&': 'max'
    },
    text: {
      TAG: 'p'
    },
    wrapper: {
      CLASS: 'static-page'
    }
  };

  window.config = {
    questionnaire: questionnaire,
    codeToName: codeToName,
    nameToCode: nameToCode,
    surveyGroup: surveyGroup,
    survey: survey,
    question: question,
    answerGroup: answerGroup,
    answer: answer,
    progress: progress,
    button: button,
    keyvisual: keyvisual,
    error: error
  };

})();

//creating
; (function () {

  function createSurveysElements(cache) {
    window.creating.surveysEntities = cache.Surveys;
    var groupElement;

    window.creating.surveysEntities.forEach(function (surveyEntity) {
      window.utils.renameParametrs(surveyEntity);
      addSurveyTypeChecking(surveyEntity);
      surveyEntity.SurveyElement = createSurveyElements(surveyEntity);

      if (surveyEntity.SurveyGroup) {
        var isGroupElement = groupElement && groupElement.dataset.code === surveyEntity.SurveyGroup;
        if (!isGroupElement) {
          groupElement = createSurveyGroupElement(surveyEntity.SurveyGroup);
          window.questionnaire.element.insertAdjacentElement('beforeend', groupElement);

          cache.Groups.forEach(function (item) {
            if (surveyEntity.SurveyGroup === item.GroupCode) {
              var groupTextElement = createSurveyGroupTextElement(item.GroupText);
              groupElement.insertAdjacentElement('beforeend', groupTextElement);
            }
          });

        }
        surveyEntity.SurveyGroupElement = groupElement;
        groupElement.insertAdjacentElement('beforeend', surveyEntity.SurveyElement);
      } else {
        window.questionnaire.element.insertAdjacentElement('beforeend', surveyEntity.SurveyElement);
      }
    });
  }

  function addSurveyTypeChecking(entity) {
    entity.IsTextType = entity.SurveyType === window.config.nameToCode.text;
    entity.IsRatingType = entity.SurveyType === window.config.nameToCode.rating;
    entity.IsSelectType = entity.SurveyType === window.config.nameToCode.select;
    entity.IsMultiSelectType = entity.SurveyType === window.config.nameToCode.multiSelect;
    entity.IsCheckboxType = entity.SurveyType === window.config.nameToCode.checkbox;
    entity.IsCaptionType = entity.SurveyType === window.config.nameToCode.caption;
    entity.IsSelectTableType = entity.SurveyType === window.config.nameToCode.selectTable;
    entity.IsSelectHorizontalType = entity.SurveyType === window.config.nameToCode.selectHorizontal;
  }

  function createSurveyGroupElement(code) {
    var element = document.createElement(window.config.surveyGroup.TAG);
    element.classList.add(window.config.surveyGroup.CLASS);
    element.id = code;
    element.dataset.code = code;

    return element;
  }

  function createSurveyGroupTextElement(text) {
    var element = document.createElement(window.config.surveyGroup.text.TAG);
    element.classList.add(window.config.surveyGroup.text.CLASS);
    element.textContent = text;

    return element;
  }

  function createSurveyElements(entity) {
    var surveyElement = createSurveyElement(entity.SurveyNo);

    //***Временно, до исключения данного типа
    if (entity.IsSelectTableType) {
      entity.SurveyType = window.config.nameToCode.select;
    }
    //***

    if (!entity.IsCheckboxType) {
      var questionElements = createQuestionElements(entity.QuestionText, entity.QuestionHint);
      surveyElement.insertAdjacentElement('beforeend', questionElements);
    }

    var surveyType = window.config.codeToName[entity.SurveyType];
    var answerConfig = window.config.answer[surveyType];
    var answerCreateFunction = window.creating[answerConfig.create];
    var answerElement = answerCreateFunction(entity, answerConfig);
    surveyElement.insertAdjacentElement('beforeend', answerElement);

    return surveyElement;
  }

  function createSurveyElement(id) {
    var element = document.createElement(window.config.survey.TAG);
    element.id = id;
    element.classList.add(window.config.survey.CLASS);

    return element;
  }

  function createQuestionElements(text, hintText) {
    var wrapperElement = createQuestionWrapperElement();

    var questionElement = createQuestionElement(text);
    wrapperElement.insertAdjacentElement('beforeend', questionElement);

    if (hintText) {
      var hintElement = createQuestionHintElement(hintText);
      wrapperElement.insertAdjacentElement('beforeend', hintElement);
    }

    return wrapperElement;
  }

  function createQuestionWrapperElement() {
    var element = document.createElement(window.config.question.wrapper.TAG);
    element.classList.add(window.config.question.wrapper.CLASS);

    return element;
  }

  function createQuestionElement(text) {
    var element = document.createElement(window.config.question.TAG);
    element.classList.add(window.config.question.CLASS);
    element.insertAdjacentHTML('afterbegin', text);
    return element;
  }

  function createQuestionHintElement(text) {
    var element = document.createElement(window.config.question.hint.TAG);
    element.classList.add(window.config.question.hint.CLASS);
    element.textContent = text;

    return element;
  }

  function createOneAnswerElement(surveyEntity, config) {
    var wrapperElement = createAnswerWrapperElement(config.wrapper.CLASS)
    var answerElements = createAnswerElements(surveyEntity, config);

    answerElements.forEach(function (item) {
      wrapperElement.insertAdjacentElement('beforeend', item);
    });

    return wrapperElement;
  }

  function createSomeAnswersElements(surveyEntity, config) {
    var groupWrapperElement = createAnswerGroupWrapperElement();
    var groupElement;
    var wrapperElement;

    surveyEntity.Answers.forEach(function (answerEntity) {
      answerEntity = window.utils.renameParametrs(answerEntity);
      var elements = createAnswerElements(surveyEntity, config, answerEntity);

      if (answerEntity.AnswerGroup) {
        var isGroupElement = groupElement && groupElement.dataset.name === answerEntity.AnswerGroup;
        if (!isGroupElement) {
          wrapperElement = createAnswerWrapperElement(config.wrapper.CLASS);
          groupElement = createAnswerGroupElements(answerEntity.AnswerGroup);
          groupElement.insertAdjacentElement('beforeend', wrapperElement);
          groupWrapperElement.insertAdjacentElement('beforeend', groupElement);
        }
        answerEntity.AnswerGroupElement = groupElement;

      } else if (!wrapperElement) {
        wrapperElement = createAnswerWrapperElement(config.wrapper.CLASS);
      }

      elements.forEach(function (item) {
        if (surveyEntity.IsRatingType) {
          //Для корректной передачи значений, порядок в JSON обратный
          wrapperElement.insertAdjacentElement('afterbegin', item);
        } else {
          wrapperElement.insertAdjacentElement('beforeend', item);
        }
      });

    });

    if (groupWrapperElement.hasChildNodes()) {
      return groupWrapperElement;
    }

    if (surveyEntity.IsSelectHorizontalType) {

      if (window.NodeList && !NodeList.prototype.forEach) {
        NodeList.prototype.forEach = Array.prototype.forEach;
      }

      var comment = wrapperElement.querySelector("div");
      var name = wrapperElement.querySelector("input").getAttribute("name");
      comment.querySelector("textarea").setAttribute('name', name);
      comment.querySelector("textarea").setAttribute('id', name);

      wrapperElement.childNodes.forEach(function(item){
        if (item.tagName === 'DIV') {
          wrapperElement.removeChild(item);
        }
      });

      var inputs = wrapperElement.cloneNode(true);
      var labels = wrapperElement.cloneNode(true);

      inputs.childNodes.forEach(function(item){
        if (item.tagName !== 'INPUT') {
          inputs.removeChild(item);
        }
      });

      labels.childNodes.forEach(function(item){
        if (item.tagName !== 'LABEL') {
          labels.removeChild(item);
        }
      });

      wrapperElement.childNodes.forEach(function(item){
        if (item.tagName === 'INPUT' && item.id !== inputs.firstChild.id && item.id !== inputs.lastChild.id) {
          var inputId = item.id;
          var label = wrapperElement.querySelector("label[for='" + inputId + "']");
          item.setAttribute('title', label.textContent);
        }
      });

     wrapperElement.childNodes.forEach(function(item){
        if (item.tagName !== 'INPUT') {
          wrapperElement.removeChild(item);
        }
     });


      var start = document.createElement("span");
      start.innerHTML = labels.firstChild.textContent;
      var finish = document.createElement("span");
      finish.innerHTML = labels.lastChild.textContent;

      wrapperElement.insertAdjacentElement('afterbegin', start);
      wrapperElement.insertAdjacentElement('beforeend', finish);

      var newDiv = document.createElement("div");
      newDiv.setAttribute('class', 'sh-answers');
      $(wrapperElement).children().wrapAll(newDiv);
      if (comment !== null) {
        wrapperElement.insertAdjacentElement('beforeend', comment);
      }

      surveyEntity.Answers.map(function (item) {

        if (item.CommentElement) {
          item.CommentElement = comment.querySelector("textarea");
        }

      });

      return wrapperElement

    }


    return wrapperElement;
  }

  function createAnswerGroupWrapperElement() {
    var element = document.createElement(window.config.answerGroup.wrapper.TAG);
    element.classList.add(window.config.answerGroup.wrapper.CLASS);

    return element;
  }

  function createAnswerWrapperElement(className) {
    var element = document.createElement(window.config.answer.wrapper.TAG);
    element.classList.add(window.config.answer.wrapper.CLASS);
    element.classList.add(className);

    return element;
  }

  function createAnswerElements(surveyEntity, config, entity) {
    var elements = [];

    if (entity) {
      var isLabel = entity.AnswerText;
      var isHint = entity.AnswerHint;
      var isComment = entity.AnswerType === window.config.answer.comment.CODE;

      entity.AnswerElement = createAnswerFieldElement(config, surveyEntity.SurveyNo, entity.AnswerNo);
      entity.AnswerNo = entity.AnswerElement.id;

      if (!surveyEntity.IsRatingType) {
        elements.push(entity.AnswerElement);
      }

      if (isLabel) {
        if (surveyEntity.IsRatingType) {
          var labelElement = createAnswerLabelElement(entity.AnswerNo);
        } else {
          labelElement = createAnswerLabelElement(entity.AnswerNo, entity.AnswerText);
        }
        elements.push(labelElement);
      }

      if (surveyEntity.IsRatingType) {
        elements.push(entity.AnswerElement);
      }

      if (isHint) {
        var hintElement = createAnswerHintElement(entity.AnswerHint)
        elements.push(hintElement);
      }

      if (isComment) {
        entity.CommentWrapperElement = createAnswerCommentWrapperElement();
        entity.CommentElement = createAnswerCommentElement(entity.AnswerNo);
        if (entity.CommentMaxLength) {
          entity.CommentElement.maxLength = entity.CommentMaxLength;
        }
        entity.CommentWrapperElement.insertAdjacentElement('beforeend', entity.CommentElement)
        elements.push(entity.CommentWrapperElement);
      }

    } else {
      var entity = {}
      entity.AnswerElement = createAnswerFieldElement(config, surveyEntity.SurveyNo);
      if (surveyEntity.IsTextType && surveyEntity.MaxAnswers) {
        entity.AnswerElement.maxLength = surveyEntity.MaxAnswers;
      }
      entity.AnswerNo = entity.AnswerElement.id;
      entity.NextSurveyNo = surveyEntity.NextSurveyNo;

      surveyEntity.Answers.push(entity);
      elements.push(entity.AnswerElement);

      if (surveyEntity.IsCheckboxType) {
        labelElement = createAnswerLabelElement(entity.AnswerNo, surveyEntity.QuestionText);
        elements.push(labelElement);
      }

      if (surveyEntity.IsCaptionType && !surveyEntity.NextSurveyNo) {
        surveyEntity.IsLastSurvey = true;
      }
    }

    return elements;
  }

  function getFieldId(surveyNo, answerNo) {
    if (!answerNo) {
      var id = surveyNo + window.config.answer.ONE_ANSWER_NO;
    } else if (answerNo.length <= window.config.answer.OLD_ANSWER_NO_LENGTH) {
      id = surveyNo + window.config.answer.DELIMITER + answerNo;
    } else {
      id = answerNo;
    }

    return id;
  }

  function createAnswerFieldElement(config, surveyNo, answerNo) {
    var element = document.createElement(config.TAG);
    element.classList.add(config.CLASS);
    element.id = getFieldId(surveyNo, answerNo);
    element.name = surveyNo;

    if (config.TYPE) {
      element.type = config.TYPE;
    }

    if (config.PLACEHOLDER) {
      element.placeholder = config.PLACEHOLDER;
    }

    return element;
  }

  function createAnswerLabelElement(inputId, text) {
    var element = document.createElement(window.config.answer.label.TAG);
    element.htmlFor = inputId;
    if (text) {
      element.insertAdjacentHTML('afterbegin', text);
    }
    element.tabIndex = window.config.answer.label.TAB_INDEX;

    return element;
  }

  function createAnswerHintElement(text) {
    var element = document.createElement(window.config.answer.hint.TAG);
    element.classList.add(window.config.answer.hint.CLASS);
    element.textContent = text;

    return element;
  }

  function createAnswerCommentWrapperElement() {
    var element = document.createElement(window.config.answer.comment.wrapper.TAG);
    element.classList.add(window.config.answer.comment.wrapper.CLASS);

    return element;
  }

  function createAnswerCommentElement(answerId) {
    var element = document.createElement(window.config.answer.comment.TAG);
    element.classList.add(window.config.answer.comment.CLASS);
    element.id = answerId + window.config.answer.comment.ID_PART;
    element.placeholder = window.config.answer.comment.PLACEHOLDER;

    return element;
  }

  function createAnswerGroupElements(groupName) {
    var groupElement = createAnswerGroupElement(groupName);
    var nameElement = createAnswerGroupNameElement(groupName)

    groupElement.insertAdjacentElement('beforeend', nameElement);

    return groupElement;
  }

  function createAnswerGroupElement(groupName) {
    var element = document.createElement(window.config.answerGroup.TAG);
    element.classList.add(window.config.answerGroup.CLASS);
    element.dataset.name = groupName;

    return element;
  }

  function createAnswerGroupNameElement(groupName) {
    var element = document.createElement(window.config.answerGroup.name.TAG);
    element.classList.add(window.config.answerGroup.name.CLASS);
    element.textContent = groupName;

    return element
  }

  window.creating = {
    surveysEntities: [],
    createSurveys: createSurveysElements,
    createOneAnswerElement: createOneAnswerElement,
    createSomeAnswersElements: createSomeAnswersElements,
  }
})();

//displaying
; (function () {

  function setCurrentSurveyEntity(activeElement) {

    if (activeElement) {
      window.displaying.currentSurveyNo = activeElement.id;
    }

    var isCurrentNo = window.displaying.currentSurveyNo;
    if (isCurrentNo) {
      window.displaying.currentSurveyEntity = window.creating.surveysEntities.find(function (item) {
        return item.SurveyNo === window.displaying.currentSurveyNo;
      });

      window.displaying.currentSurveyEntity.AnswersAsInputElements = window.displaying.currentSurveyEntity.Answers.filter(function (item) {
        if (item.AnswerElement.tagName === 'INPUT') {
          return item;
        }
      });

      if (window.displaying.currentSurveyEntity.AnswersAsInputElements) {
        window.displaying.currentSurveyEntity.CheckedAnswers = window.displaying.currentSurveyEntity.Answers.filter(function (item) {
          if (item.AnswerElement.checked === true) {
            return item;
          }
        });

        window.displaying.currentSurveyEntity.CheckedAnswersWithComment = window.displaying.currentSurveyEntity.Answers.filter(function (item) {
          if (item.CommentElement && item.AnswerElement.checked === true) {
            return item;
          }
        });
      }
    }
  }

  function showCurrentSurveyElement() {
    if (window.displaying.currentSurveyEntity && window.displaying.currentSurveyEntity.SurveyElement) {
      window.utils.showElement(window.displaying.currentSurveyEntity.SurveyElement);
    }
  }

  function showCurrentSurveyGroupElement() {
    if (window.displaying.currentSurveyEntity && window.displaying.currentSurveyEntity.SurveyGroupElement) {
      window.utils.showElement(window.displaying.currentSurveyEntity.SurveyGroupElement);
    }
  }

  function swapCurrentSurveyElement() {
    if (window.displaying.nextSurveyEntity) {
      if (window.displaying.currentSurveyEntity.SurveyGroupElement) {
        swapCurrentSurveyGroupElement();
      } else {
        window.utils.hideElement(window.displaying.currentSurveyEntity.SurveyElement);
      }

      window.displaying.currentSurveyNo = window.displaying.nextSurveyEntity.SurveyNo;
      setCurrentSurveyEntity();

      if (window.displaying.currentSurveyEntity.IsLastSurvey) {
        window.utils.hideElement(window.progress.element);
        window.utils.hideElement(window.progress.outputElement);
        window.utils.hideElement(window.button.nextElement);
      }

      showCurrentSurveyElement();
    } else {
      console.log('Нет следующего вопроса');
    }
  }

  function swapCurrentSurveyGroupElement() {
    var isNewGroup = window.displaying.nextSurveyEntity.SurveyGroupElement &&
      window.displaying.currentSurveyEntity.SurveyGroupElement !== window.displaying.nextSurveyEntity.SurveyGroupElement;
    var isNotNextGroup = !window.displaying.nextSurveyEntity.SurveyGroupElement;

    if (isNewGroup) {
      window.utils.hideElement(window.displaying.currentSurveyEntity.SurveyGroupElement);
      window.utils.showElement(window.displaying.nextSurveyEntity.SurveyGroupElement);
      window.progress.changeValue();
    } else if (isNotNextGroup) {
      window.utils.hideElement(window.displaying.currentSurveyEntity.SurveyGroupElement);
    }
  }

  function setNextSurveyEntity() {
    if (window.displaying.currentSurveyEntity.CheckedAnswers) {
      var currentAnswerEntity = window.displaying.currentSurveyEntity.CheckedAnswers[0];
    }

    if (currentAnswerEntity) {
      window.displaying.nextSurveyEntity = window.creating.surveysEntities.find(function (item) {
        return item.SurveyNo === currentAnswerEntity.NextSurveyNo;
      });

      if (!window.displaying.nextSurveyEntity) {
        window.displaying.nextSurveyEntity = window.creating.surveysEntities.find(function (item) {
          return item.SurveyNo === window.displaying.currentSurveyEntity.NextSurveyNo;
        });
      }

    } else if (!currentAnswerEntity && window.displaying.currentSurveyEntity.NextSurveyNo) {
      window.displaying.nextSurveyEntity = window.creating.surveysEntities.find(function (item) {
        return item.SurveyNo === window.displaying.currentSurveyEntity.NextSurveyNo;
      });
    } else {
      window.displaying.nextSurveyEntity = undefined;
    }

  }

  function setCurrentAndNextOnInputChange(target) {
    window.displaying.currentSurveyNo = target.name;
    window.displaying.setCurrentSurveyEntity();
    window.displaying.setNextSurveyEntity();
  }

  function checkIsLastElementInCurrentGroup() {
    return window.displaying.currentSurveyEntity.SurveyGroupElement && window.displaying.nextSurveyEntity && window.displaying.currentSurveyEntity.SurveyGroupElement !== window.displaying.nextSurveyEntity.SurveyGroupElement;
  }

  function showNextElementInCurrentGroup() {
    var isGroup = window.displaying.currentSurveyEntity.SurveyGroupElement;
    var isLast = checkIsLastElementInCurrentGroup();

    if (isGroup && !isLast) {
      window.displaying.swapCurrentSurveyElement();
    } else if (!isGroup || isLast) {
      return true;
    }
  }

  function hideNextElementsInCurrentGroup() {
    var isSameGroupCode = window.displaying.nextSurveyEntity && window.displaying.currentSurveyEntity.SurveyGroupElement === window.displaying.nextSurveyEntity.SurveyGroupElement;
    var isCurrentAndNextSurveyElementAreNotNear = window.displaying.nextSurveyEntity && window.displaying.currentSurveyEntity.SurveyElement.nextElementSibling !== window.displaying.nextSurveyEntity.SurveyElement;
    var isNotVisibleNextSurveyElement = window.displaying.nextSurveyEntity && !window.displaying.nextSurveyEntity.SurveyElement.classList.contains(window.utils.class.VISIBLE);

    if (isSameGroupCode && isNotVisibleNextSurveyElement || !isSameGroupCode || isSameGroupCode && isCurrentAndNextSurveyElementAreNotNear) {
      var currentSurveyElementIndex;
      var visibleSurveyElements = window.displaying.getVisibleSurveyElements();

      visibleSurveyElements.forEach(function (item, i) {
        if (item === window.displaying.currentSurveyEntity.SurveyElement) {
          currentSurveyElementIndex = i;
        }
      });


      visibleSurveyElements.forEach(function (item, i) {
        var isSurveyBelowCurrentSurveyElement = i > currentSurveyElementIndex;
        if (isSurveyBelowCurrentSurveyElement) {
          window.utils.hideElement(item);
          window.error.hide(item);
        }
      });
    }
  }

  /*function setFocus(element) {
    if (element) {
      element.focus();
    } else if (!window.displaying.currentSurveyEntity.IsTextType && !window.displaying.currentSurveyEntity.IsCaptionType) {
      var labelElement = window.displaying.currentSurveyEntity.AnswerInputElements[0].nextElementSibling;
      labelElement.focus();
    } else if (window.displaying.currentSurveyEntity.IsTextType) {
      window.displaying.currentSurveyEntity.Answers[0].AnswerElement.focus();
    } else {
      window.button.nextElement.focus();
    }
  }*/

  function getVisibleSurveyElements() {
    if (window.displaying.currentSurveyEntity.SurveyGroupElement) {
      var visibleSurveyElements = Array.from(window.displaying.currentSurveyEntity.SurveyGroupElement.querySelectorAll('.' + window.config.survey.CLASS + '.' + window.utils.class.VISIBLE));
    } else {
      visibleSurveyElements = [window.displaying.currentSurveyEntity.SurveyElement];
    }

    return visibleSurveyElements;
  }

  window.displaying = {
    currentSurveyNo: '',
    currentSurveyEntity: {},
    setCurrentSurveyEntity: setCurrentSurveyEntity,
    swapCurrentSurveyElement: swapCurrentSurveyElement,
    showCurrentSurveyElement: showCurrentSurveyElement,
    showCurrentSurveyGroupElement: showCurrentSurveyGroupElement,
    nextSurveyEntity: {},
    setNextSurveyEntity: setNextSurveyEntity,
    getVisibleSurveyElements: getVisibleSurveyElements,
    //setFocus: setFocus,
    setCurrentAndNextOnInputChange: setCurrentAndNextOnInputChange,
    showNextElementInCurrentGroup: showNextElementInCurrentGroup,
    hideNextElementsInCurrentGroup: hideNextElementsInCurrentGroup,
  }
})();

//questionnaire
; (function () {

  var questionnaireElement = document.querySelector('#' + window.config.questionnaire.ID);

  function checkGettingStatus(data) {
    console.log(data)
    if (data && data.Questions) {
      createQuestionnaireContent(data);
    } else {
      window.error.createIfNoData();
    }
  }

  function createDescriptionElement(cache) {
    var description = cache.Description;
    if (description) {
      questionnaireElement.insertAdjacentHTML('afterbegin', description);
    }
  }

  function createKeyvisualElement(cache) {
    var url = cache.KeyvisualLink;

    if (url) {
      var element = document.createElement(window.config.keyvisual.TAG);
      element.classList.add(window.config.keyvisual.CLASS);
      element.src = url;
      questionnaireElement.insertAdjacentElement('afterbegin', element);
    }
  }

  function setFirstSurveyNo(cache) {
    window.displaying.currentSurveyNo = cache.FirstSurveyNo;
  }

  function createQuestionnaireContent(data) {
    //surveyGroupElement отображается раньше surveyElement, чтобы отработал фокус на первом ответе

    var cache = window.utils.renameParametrs(data);
    window.creating.createSurveys(cache);
    window.progress.create(cache);
    window.button.create(cache);
    createDescriptionElement(cache);
    createKeyvisualElement(cache);
    setFirstSurveyNo(cache);
    window.displaying.setCurrentSurveyEntity();
    window.displaying.showCurrentSurveyGroupElement();
    window.displaying.showCurrentSurveyElement();
    questionnaireElement.addEventListener('change', onQuestionnaireElementChange);

    window.config.error.isFailure.TEXT = cache.FailureMessage;
  }

  function onQuestionnaireElementChange(evt) {
    evt.preventDefault();
    window.displaying.setCurrentAndNextOnInputChange(evt.target);
    //Элементы скрываются, если ответ перевыбран и за ним идет другой вопрос
    window.displaying.hideNextElementsInCurrentGroup();
    window.displaying.showNextElementInCurrentGroup();
  }

  window.questionnaire = {
    checkStatus: checkGettingStatus,
    element: questionnaireElement,
  }
})();

//validation
; (function () {

  function checkVisibleSurveys() {
    var visibleSurveyElements = window.displaying.getVisibleSurveyElements();
    var valide = true;
    visibleSurveyElements.forEach(function (item) {
      window.displaying.setCurrentSurveyEntity(item);
      window.error.hide(item);
      if (!validateCurrentSurvey(true)) {
        valide = false;
      }
    });

    return valide;
  }

  function validateTextFieldElement(value, minValue, regexpString) {
    var isTooShort = minValue > value.length;

    if (regexpString) {
      var flags = regexpString.replace(/.*\/([gimy]*)$/, '$1');
      var pattern = regexpString.replace(new RegExp('^/(.*?)/' + flags + '$'), '$1');
      var regexp = new RegExp(pattern, flags);
      var isNotMatchWithRegexp = !regexp.test(value);
    }

    return {
      isTooShort: isTooShort,
      isNotMatchWithRegexpAndNotMandatory: !minValue && value.length && isNotMatchWithRegexp,
      isNotMatchWithRegexpAndManadatory: minValue && !isTooShort && isNotMatchWithRegexp
    };
  }

  function validateInputFieldElements(value, minValue, maxValue) {
    return {
      isTooFew: minValue > value,
      isTooMany: maxValue < value
    }
  }

  function validateCurrentSurvey(isShowError) {

    if (window.displaying.currentSurveyEntity.MinAnswers) {
      var minValue = Number(window.displaying.currentSurveyEntity.MinAnswers);
    }

    if (window.displaying.currentSurveyEntity.MaxAnswers) {
      var maxValue = Number(window.displaying.currentSurveyEntity.MaxAnswers);
    }

    if (window.displaying.currentSurveyEntity.IsTextType) {
      var currentValue = window.displaying.currentSurveyEntity.Answers[0].AnswerElement.value;
      var currentLength = currentValue.length;
      var status = validateTextFieldElement(currentValue, minValue, window.displaying.currentSurveyEntity.TextRegexp);
    } else if (!window.displaying.currentSurveyEntity.IsCaptionType) {
      currentValue = window.displaying.currentSurveyEntity.CheckedAnswers.length;
      currentLength = currentValue;
      status = validateInputFieldElements(currentValue, minValue, maxValue);

      var commentsInvalidTypes = [];
      var commentsInvalidEntities = [];
      var commentsInvalidValues = [];

      window.displaying.currentSurveyEntity.CheckedAnswersWithComment.forEach(function (item) {
        var minLength = Number(item.CommentMinLength);
        var currentValue = item.CommentElement.value;
        var status = validateTextFieldElement(currentValue, minLength, item.CommentRegexp);
        var type = window.utils.getTrueKeyInObject(status);
        commentsInvalidTypes.push(type);
        commentsInvalidEntities.push(item);

        var value = {
          min: minLength,
          current: currentValue.length
        };
        commentsInvalidValues.push(value);
      });
    }

    var invalidType = window.utils.getTrueKeyInObject(status);
    if (invalidType) {
      if (isShowError) {
        var value = {
          min: minValue,
          max: maxValue,
          current: currentLength
        };
        window.error.show(window.config.error[invalidType], window.displaying.currentSurveyEntity, value);
      }
    }

    if (commentsInvalidTypes) {
      var commentInvalidType;
      commentsInvalidTypes.forEach(function (item, i) {
        if (item && isShowError) {
          commentInvalidType = item;
          window.error.show(window.config.error[item], commentsInvalidEntities[i], commentsInvalidValues[i]);
        }
      });
    }

    if (invalidType || commentInvalidType) {
      return false;
    }
    return true;
  }

  window.validation = {
    check: checkVisibleSurveys,
  };
})();

//saving
; (function () {
  function saveCurrentSurveyData() {

    var results = [];

    if (!window.displaying.currentSurveyEntity.IsCaptionType && !window.displaying.currentSurveyEntity.IsTextType) {
      results = window.displaying.currentSurveyEntity.CheckedAnswers.map(function (item) {
        var comment = '';
        if (item.CommentElement) {
          comment = item.CommentElement.value;
        }

        return {
          guid: window.xhr.guid,
          uid: window.xhr.uid,
          questionNo: window.displaying.currentSurveyEntity.SurveyNo,
          answerNo: item.AnswerNo,
          answerComment: comment
        };
      });

      if (!results.length) {
        results.push({
          guid: window.xhr.guid,
          uid: window.xhr.uid,
          questionNo: window.displaying.currentSurveyEntity.SurveyNo,
          answerNo: '',
          answerComment: ''
        });
      }

    } else if (window.displaying.currentSurveyEntity.IsTextType) {
      results.push({
        guid: window.xhr.guid,
        uid: window.xhr.uid,
        questionNo: window.displaying.currentSurveyEntity.SurveyNo,
        answerNo: '',
        answerComment: window.displaying.currentSurveyEntity.Answers[0].AnswerElement.value
      });
    }

    window.xhr.resultConfig.data = {
      list: JSON.stringify(results)
    };
    console.log(window.xhr.resultConfig);
    window.xhr.create(window.xhr.resultConfig);
  }

  function checkSavingStatus(data) {
    console.log(data)
    if (data && data.Result === 'OK') {
      window.error.check(true);
    } else {
      window.error.createIfFailure();
    }
  }

  function saveVisibleSurveys() {
    var visibleSurveyElements = window.displaying.getVisibleSurveyElements();
    visibleSurveyElements.forEach(function (item) {
      window.displaying.setCurrentSurveyEntity(item);
      saveCurrentSurveyData();
    });
  }

  window.saving = {
    save: saveVisibleSurveys,
    checkStatus: checkSavingStatus
  };

})();

//error
; (function () {

  function replaceSymbolsToValues(valueString, value) {
    var valueArray = valueString.split('');
    for (var i = 0; i < valueArray.length; i++) {
      if (window.config.error.symbolToValue[valueArray[i]]) {
        valueArray[i] = value[window.config.error.symbolToValue[valueArray[i]]];
      }
    }
    valueString = valueArray.join('');

    return valueString;
  }

  function getErrorMessageValue(config, entity, value) {
    if (config.getValueFromCache) {
      var valueFromCache = config.getValueFromCache(entity);
    }
    var valueString = valueFromCache || config.TEXT;
    valueString = replaceSymbolsToValues(valueString, value);

    return valueString;
  }

  function createErrorHeaderElement(text) {
    var element = document.createElement(window.config.error.header.TAG);
    element.textContent = text;

    return element;
  }

  function createErrorTextElement() {
    var element = document.createElement(window.config.error.text.TAG);

    return element;
  }

  function createErrorElement(config) {
    var element = document.createElement(window.config.error.TAG);
    element.classList.add(window.config.error.CLASS);

    if (config.HEADER_TEXT) {
      var headerElement = createErrorHeaderElement(config.HEADER_TEXT);
      element.insertAdjacentElement('beforeend', headerElement);
    }

    var textElement = createErrorTextElement();
    element.insertAdjacentElement('beforeend', textElement);

    return element;
  }

  function showErrorElement(config, entity, value) {
    if (entity) {
      var parentElement = entity.SurveyElement || entity.CommentWrapperElement
    } else {
      parentElement = window.questionnaire.element;
    }

    var errorElement = parentElement.querySelector('.' + window.config.error.CLASS);
    if (!errorElement) {
      errorElement = createErrorElement(config);
      parentElement.insertAdjacentElement('beforeend', errorElement);
    }
    errorElement.querySelector(window.config.error.text.TAG).textContent = getErrorMessageValue(config, entity, value);
    window.utils.showElement(errorElement);
  }

  function hideErroElements(parentElement) {
    var errorElements = Array.from(parentElement.querySelectorAll('.' + window.config.error.CLASS));
    errorElements.forEach(function (item) {
      item.querySelector(window.config.error.text.TAG).textContent = '';
      window.utils.hideElement(item);
    });
  }

  function checkIsError(isSwap) {
    var visibleParentElement = window.displaying.currentSurveyEntity.SurveyGroupElement || window.displaying.currentSurveyEntity.SurveyElement;
    var visibleErrorElements = getVisibleErrors(visibleParentElement);

    var isError = visibleErrorElements.length;
    if (!isError && isSwap) {
      window.displaying.swapCurrentSurveyElement();
    } else if (isError) {
      scrollToFirstError(visibleErrorElements);
    }
  }

  function createIfNoGuid() {
    showErrorElement(window.config.error.isNoGuid);
  }

  function createIfNoData() {
    showErrorElement(window.config.error.isNoData);
  }

  function createIfFailure() {
    showErrorElement(window.config.error.isFailure, window.displaying.currentSurveyEntity);
  }

  function getVisibleErrors(parentElement) {
    var errorElements = Array.from(parentElement.querySelectorAll('.' + window.config.error.CLASS));
    var visibleErrorElements = errorElements.filter(function (item) {
      return item.classList.contains(window.utils.class.VISIBLE);
    });

    return visibleErrorElements;
  }

  function scrollToFirstError(visibleErrorElements) {
    var firstParentElementWithError = visibleErrorElements[0].parentElement;
    window.utils.slowScrollToElement(firstParentElementWithError);

    /*var isParentElementIsSurvey = firstParentElementWithError.classList.contains(window.config.survey.CLASS);
    var isParentElementIsCommentWrapper = firstParentElementWithError.classList.contains(window.config.answer.comment.wrapper.CLASS);
 
    if (isParentElementIsSurvey) {
      window.displaying.setCurrentSurveyEntity(firstParentElementWithError);
      window.displaying.setFocus();
    } else if (isParentElementIsCommentWrapper) {
      window.displaying.setFocus(firstParentElementWithError.querySelector('.' + window.config.answer.comment.CLASS));
    }*/
  }

  window.error = {
    show: showErrorElement,
    hide: hideErroElements,
    check: checkIsError,
    createIfNoGuid: createIfNoGuid,
    createIfNoData: createIfNoData,
    createIfFailure: createIfFailure
  };
})();

//xhr
; (function () {
  var StatusCode = {
    SUCCESS: 200,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    SERVER_ERROR: 500
  };
  var TIMEOUT_MS = 3000;

  var surveyConfig = {
    url: 'https://ssl.samsung.ru/localCMS/HappyMail/Survey_Get/',
    type: 'POST',
    data: {
      guid: '',
      uid: ''
    },
    responseType: 'json',
    onSuccess: window.questionnaire.checkStatus,
    onError: window.error.createIfNoData
  }

  var resultConfig = {
    url: 'https://ssl.samsung.ru/LocalCMS/HappyMail/Result_InsertList',
    type: 'POST',
    data: {
      guid: '',
      uid: ''
    },
    onSuccess: window.saving.checkStatus,
    onError: window.error.createIfFailure
  }

  function createXhrRequest(config) {
    $.ajax({
      url: config.url,
      type: config.type,
      data: config.data,
      responseType: config.responseType,
      contentType: config.contentType,
      traditional: true,
      statusCode: {
        '200': config.onSuccess,
        '400': config.onError,
        '404': config.onError,
        '500': config.onError
      }
    });

    /*var xhr = new XMLHttpRequest();
    xhr.responseType = config.responseType;
    xhr.timeout = TIMEOUT_MS;
 
 
    xhr.addEventListener('load', function () {
      var isSuccess = xhr.status === StatusCode.SUCCESS;
      if (isSuccess) {
        config.onSuccess(xhr.response);
      } else {
        config.onError();
      }
    });
 
    xhr.addEventListener('error', function () {
      config.onError();
    });
 
    xhr.addEventListener('timeout', function () {
      config.onError();
    });
 
    xhr.open(config.type, config.url);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(config.data);
 
    return xhr;*/
  }


  window.xhr = {
    guid: '',
    uid: '',
    surveyConfig: surveyConfig,
    resultConfig: resultConfig,
    create: createXhrRequest
  };
})();

//answers 
; (function () {
  var ENTER_KEYCODE = 13;
  var LABEL_TAG_NAME = 'LABEL';

  function changeRadioAndCheckbox(evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      var label = evt.target;
      var input = label.previousElementSibling;
      var isLabel = label.tagName === LABEL_TAG_NAME;

      if (input && isLabel) {
        var isChecked = input.checked === true;
        if (isChecked) {
          input.checked = false;
        } else {
          input.checked = true;
        }
        window.displaying.setCurrentAndNextOnInputChange(input);
        //Если ответ перевыбран и за ним идет другой вопрос
        window.displaying.hideNextElementsInCurrentGroup();
        window.displaying.showNextElementInCurrentGroup();
      }
    }
  }

  window.answers = {
    changeRadioAndCheckbox: changeRadioAndCheckbox,
  }
})();

//buttons
; (function () {

  function createButtonsWrapperElement() {
    var elemenet = document.createElement(window.config.button.wrapper.TAG);
    elemenet.classList.add(window.config.button.wrapper.CLASS);

    return elemenet;
  }

  function createButtonElement(uniqueConfig, text) {
    var element = document.createElement(window.config.button.TAG);
    element.classList.add(uniqueConfig.CLASS);
    element.id = uniqueConfig.ID;
    element.textContent = text || uniqueConfig.TEXT;

    return element;
  }

  function createButtonsElements(cache) {
    var wrapperElement = createButtonsWrapperElement();
    var nextButtonText = cache.NextButtonText;
    var nextButtonElement = createButtonElement(window.config.button.next, nextButtonText);
    window.button.nextElement = nextButtonElement;
    wrapperElement.insertAdjacentElement('beforeend', nextButtonElement);
    window.utils.showElement(nextButtonElement);

    /*var backButtonText = cache.BackButtonText;
    var backButtonElement = createButtonElement(window.config.button.back, backButtonText);
    window.button.backElement = backButtonElement;
    wrapperElement.insertAdjacentElement('beforeend', backButtonElement);*/

    window.questionnaire.element.insertAdjacentElement('beforeend', wrapperElement);
    nextButtonElement.addEventListener('click', onNextButtonElementClick);
  }

  function onNextButtonElementClick(evt) {
    evt.preventDefault();
    var valide = window.validation.check();
    window.error.check();
    window.displaying.setNextSurveyEntity();
    var isLastSurvey = window.displaying.showNextElementInCurrentGroup();
    if (isLastSurvey && valide) {
      window.saving.save();
    }
  }

  window.button = {
    nextElement: null,
    //backElement: null,
    create: createButtonsElements
  }
})();

//progress
; (function () {

  function createProgressElements(cache) {
    var groups = cache.Groups;

    if (groups.length) {
      var progressWrapperElement = createProgressWrapperElement();

      var progressElement = createProgressElement(groups.length)
      progressWrapperElement.insertAdjacentElement('beforeend', progressElement);

      var outputElement = createProgressOutputElement(groups.length);
      progressWrapperElement.insertAdjacentElement('beforeend', outputElement);

      window.questionnaire.element.insertAdjacentElement('afterbegin', progressWrapperElement);

      window.progress.groups = groups;
      window.progress.element = progressElement;
      window.progress.outputElement = outputElement;

      changeOutputPosition();
    }
  }

  function createProgressWrapperElement() {
    var element = document.createElement(window.config.progress.wrapperElement.TAG);
    element.classList.add(window.config.progress.wrapperElement.CLASS);

    return element;
  }

  function createProgressElement(maxValue) {
    var element = document.createElement(window.config.progress.element.TAG);
    element.classList.add(window.config.progress.element.CLASS);
    element.id = window.config.progress.element.ID;
    element.value = window.config.progress.element.START_VALUE;
    element.max = maxValue;
    window.utils.showElement(element);

    return element;
  }

  function createProgressOutputElement(maxValue) {
    var element = document.createElement(window.config.progress.outputElement.TAG);
    element.classList.add(window.config.progress.outputElement.CLASS);
    element.textContent = window.config.progress.element.START_VALUE + window.config.progress.outputElement.SLASH + maxValue;
    window.utils.showElement(element);

    return element;
  }

  function changeOutputPosition() {
    window.progress.outputElement.style.left = window.progress.element.clientWidth * (window.progress.element.position / 2) - window.progress.outputElement.clientWidth + 'px';
  }

  function changeProgressElementValue() {
    var value;
    window.progress.groups.forEach(function (item, i) {
      if (item.GroupCode === window.displaying.nextSurveyEntity.SurveyGroup) {
        value = i + window.config.progress.element.INCREASE;
      }
    });

    window.progress.element.value = value;
    window.progress.outputElement.textContent = window.progress.element.value + window.config.progress.outputElement.SLASH + window.progress.element.max;
    changeOutputPosition();
  }

  window.progress = {
    create: createProgressElements,
    changeValue: changeProgressElementValue,
    groups: [],
    element: null,
    outputElement: null
  }
})();


