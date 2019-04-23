String.format = (strFormat, ...args) => {
    return strFormat.replace(/{(\d+)}/g, (match, number) => {
        return typeof args[number] != 'undefined'
            ? args[number]
            : match;
    });
};

const errorMessages = {
    containerElementNotSpecified: 'Не задано елемент контейнера.',
    nonValidTag: 'Невалідний HTML тег для {0}.',
    badChildElement: 'The child element {0} is incorrectly recorded.',
    badAttribute: 'Значення атрибуту {0} для тегу {1} повинен бути типом "string" або "number".',
    badNameAttribute: 'Ім\'я атрибуту {0} для елементу {1} задано невірно.'
}

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

const isStringOrNumber = (attribute) => {
    return typeof attribute === 'string' || typeof attribute === 'number';
}

const createElement = (nameElement, attribute = undefined, innerElement = undefined) => {

    let elementDOM = document.createElement(`${nameElement}`);
    if (elementDOM instanceof HTMLUnknownElement) 
        throw Error(String.format(errorMessages.nonValidTag, nameElement.toUpperCase()));
    
    if (attribute !== undefined) {
        Object
            .entries(attribute)
            .map(el => {
                console.log(el);
                // Добавлення класу через "className"
                if (el[0] === 'className') {
                    if (isStringOrNumber(el[0])) 
                        elementDOM.className = `${el[1]}`;
                    else 
                        throw Error(`Значення атрибуту "${el[0]}" для тегу "${nameElement.toUpperCase()}" повинен бути типом 'string' чи 'number'.`);
                        // Добавлення класу через "classList"
                    }
                else if (el[0] === 'classList') {
                    if (isStringOrNumber(el[0])) 
                        elementDOM.classList = el[1];
                    else 
                        throw Error(`Значення атрибуту "${el[0]}" для тегу "${nameElement.toUpperCase()}" повинен бути типом 'string' чи 'number'.`);
                    
                    if (Array.isArray(el[1])) 
                        el[1].map(elem => {
                            if (isStringOrNumber(el[0])) 
                                elementDOM.classList.add(`${elem}`);
                            else 
                                throw Error(`Значення масиву, атрибуту "${el[0]}" для тегу "${nameElement.toUpperCase()}" повині бути типом 'string' чи 'number'.`);
                            }
                        );
                        // Добавлення текстового вмісту елемента через "textContent"
                    }
                else if (el[0] === 'textContent') {
                    typeof el[1] === 'object' && el[1] !== null
                        ? elementDOM.textContent = JSON.stringify(el[1])
                        : elementDOM.textContent = el[1];
                    // Добавлення стилів елементу через "style"
                } else if (el[0] === 'style') {
                    Object
                        .entries(el[1])
                        .map(elem => {
                            if (elementDOM.style[`${elem[0]}`] !== undefined) 
                                if (isStringOrNumber(elem[1])) 
                                    elementDOM.style.setProperty(`${convertCamelCaseToNameAttribute(elem[0])}`, `${elem[1]}`);
                                else 
                                    throw Error(`Значення стилю атрибуту "${elem[0]}" для тегу "${nameElement.toUpperCase()}" повинен бути типом 'string' чи 'number'.`);
                        else 
                                throw Error(`Ім'я стилю "${elem[0]}" для тегу "${nameElement.toUpperCase()}" задано не вірно.`);
                            }
                        );
                } else {
                    //Опрацювання всіх решти заданих атрибутів
                    if (isStringOrNumber(el[1])) 
                        elementDOM.setAttribute(`${convertCamelCaseToNameAttribute(el[0])}`, `${el[1]}`);
                    else 
                        throw Error(String.format(errorMessages.badAttribute, el[0], nameElement.toUpperCase()));
                    }
                });
    }

    if (innerElement !== undefined) {

        if (!Array.isArray(innerElement)) {
            let arr = new Array();
            arr.push(innerElement)
            innerElement = arr;
        };

        innerElement.map(el => {
            if (el instanceof HTMLElement && el.nodeType === 1) {
                elementDOM.appendChild(el);
            } else if (typeof el === 'string') {
                elementDOM.appendChild(document.createTextNode(el));
            } else {
                throw Error(String.format(errorMessages.badChildElement, el));
            }
        });
    };

    return elementDOM;
};

const render = (childElement = undefined, parentElement = undefined) => {

    if (parentElement !== undefined) {
        if (Array.isArray(parentElement) || parentElement instanceof HTMLUnknownElement || parentElement.nodeType !== Node.ELEMENT_NODE) 
            throw Error(String.format(errorMessages.nonValidTag, parentElement.nodeName));
        }
    else {
        throw Error(errorMessages.containerElementNotSpecified);
    }

    if (childElement instanceof HTMLUnknownElement) 
        throw Error(String.format(errorMessages.nonValidTag, childElement.nodeName));
    
    parentElement.appendChild(childElement);
}

const React = {
    createElement,
    render
}

const app = React.createElement('div', {
    style: {
        backgroundColor: 'red'
    }
}, [
    React.createElement('span', undefined, 'Hello world'),
    React.createElement('br'),
    'This is just a text node',
    React.createElement('div', {textContent: 'Text content'})
]);

React.render(app, document.getElementById('root'),);