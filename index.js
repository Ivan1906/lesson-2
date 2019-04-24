const errorMessages = {
    nonParentElement: 'Не задано елемент контейнера.',
    badParentElement: 'Батьківський елемент {0} являється невалідним.', 
    nonValidTag: 'Задано невалідний HTML тег {0}.',
    nonChildElement: 'Незадано елемент для вставки.',
    badChildElement: 'Дочірний елемент {0} являється невалідним.',
    badAttributes: 'Параметр "attributes" повинен бути типом "Object".',
    badAttribute: 'Значення атрибуту {0} для елементу {1} повинен бути типом "string" або "number".',
    badNameAttribute: 'Ім\'я атрибуту {0} для елементу {1} задано невірно.',
    isStringAttribute: 'Значення {0} не відповідає типу "String" для атрибуту {1}.',
    isNumberAttribute: 'Значення {0} не відповідає типу "Number" для атрибуту {1}.',
    isArrayAttribute: 'Значення {0} не відповідає типу "Array" для атрибуту {1}.',
    isObjectAttribute: 'Значення {0} не відповідає типу "Object" для атрибуту {1}.'
};

const formatStr = (format, ...args) => {
    return format.replace(/{(\d+)}/g, (match, number) => {
        return typeof args[number] != 'undefined'
            ? args[number]
            : match;
    });
};

const convertCamelCaseToNameAttribute = (nameAttribute) => {
    let codeLetterA = "A".charCodeAt();
    let codeLetterZ = "Z".charCodeAt();
    return nameAttribute
        .split("")
        .reduce((previousValue, currentValue) => {
            return (codeLetterA <= currentValue.charCodeAt() && codeLetterZ >= currentValue.charCodeAt())
                ? previousValue.concat('-', currentValue.toLowerCase())
                : previousValue.concat(currentValue);
        }, "");
};

const isString = (value) => {
    return typeof value === 'string';
};

const isNumber = (value) => {
    return typeof value === 'number';
};

const isArray = (value) => {
    return Array.isArray(value);
};

const isObject = (value) => {
    return typeof value === 'object' && value !== null;
};

const createElement = (nameElement, attributes = undefined, innerElement = undefined) => {

    let elementDOM = document.createElement(`${nameElement}`);
    if (elementDOM instanceof HTMLUnknownElement) {
        throw Error(formatStr(errorMessages.nonValidTag, nameElement.toUpperCase()));
    }
    
    if (attributes !== undefined) {
        
        if(typeof attributes !== 'object') {
            throw Error(errorMessages.badAttributes);
        }
        
        Object
            .entries(attributes)
            .map(attribute => {
                
                let name = attribute[0];
                let value = attribute[1];
                
                switch (name) {
                    case 'className':
                        if (!isString(value))
                            throw Error(formatStr(errorMessages.isStringAttribute, value, name.toUpperCase()));
                        elementDOM.className = value;   
                        break;

                    case 'classList':
                        if (!isArray(value))
                            throw Error(formatStr(errorMessages.isArrayAttribute, value, name.toUpperCase()));

                        value.map(nameClass => {
                            if (!isString(nameClass))
                                throw Error(formatStr(errorMessages.isStringAttribute, nameClass, name.toUpperCase()));
                            elementDOM.classList.add(nameClass);
                        });
                        break;

                    case 'textContent':
                        if (!isString(value))
                            throw Error(formatStr(errorMessages.isStringAttribute, value, name.toUpperCase()));
                        elementDOM.textContent = value;
                        break;

                    case 'style':
                        if (!isObject(value))
                            throw Error(formatStr(errorMessages.isObjectAttribute, value, name.toUpperCase()));

                        Object.keys(value).map(nameAttr => {
                            if (elementDOM.style[`${nameAttr}`] === undefined)
                                throw Error(formatStr(errorMessages.badNameAttribute, nameAttr, nameElement.toUpperCase()));

                            if ( !isString(value[nameAttr]) ) {
                                if ( !isNumber(value[nameAttr]) ) {
                                    throw Error(formatStr(errorMessages.badAttribute, value[nameAttr], nameElement.toUpperCase()));
                                };
                            };
                                
                            elementDOM.style.setProperty(convertCamelCaseToNameAttribute(nameAttr), `${value[nameAttr]}`);
                        });
                        break;
                
                    default:
                        if (!isString(value)) {
                            if (!isNumber(value)) {
                                throw Error(formatStr(errorMessages.badAttribute, value, nameElement.toUpperCase()));
                            };
                        };
                            
                        elementDOM.setAttribute(convertCamelCaseToNameAttribute(name), `${value}`);
                        break;
                };
        });
    };

    if (innerElement !== undefined) {

        if (!Array.isArray(innerElement)) {
            if (innerElement instanceof HTMLElement || typeof innerElement === 'string') {
                innerElement = new Array(innerElement);
            } else {
                throw Error(formatStr(errorMessages.badChildElement, innerElement));
            };
        };

        innerElement.map(el => {
            if (el instanceof HTMLElement && el.nodeType === 1) {
                elementDOM.appendChild(el);
            } else if (typeof el === 'string') {
                elementDOM.appendChild(document.createTextNode(el));
            } else {
                throw Error(formatStr(errorMessages.badChildElement, el));
            }
        });
    };

    return elementDOM;
};

const render = (childElement = undefined, parentElement = undefined) => {

    if (childElement === undefined) {
        throw Error(errorMessages.nonChildElement);
    } else if (childElement instanceof HTMLUnknownElement) {
        throw Error(formatStr(errorMessages.nonValidTag, childElement.nodeName));
    };

    if (parentElement === undefined) {
        throw Error(errorMessages.nonParentElement);
    } else if (Array.isArray(parentElement) || 
                parentElement instanceof HTMLUnknownElement || 
                parentElement.nodeType !== Node.ELEMENT_NODE) {
        throw Error(formatStr(errorMessages.badParentElement, parentElement.nodeName));
    };
    
    parentElement.appendChild(childElement);
}

const React = {
    createElement,
    render
}

const app = React.createElement('div', {
    id: 21,
    style: {
        backgroundColor: 'red',
        border: '2px solid green'
    },
    className: 'one',
    classList: ['two', 'three']
}, [
    React.createElement('span', undefined, 'Hello world'),
    React.createElement('br'),
    'This is just a text node',
    React.createElement('div', {textContent: 'Text content', style: {fontSize: '20px', color: 'yellow'}})
]);

React.render(app, document.getElementById('root'));