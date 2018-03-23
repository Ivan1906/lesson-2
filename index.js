function convertCamelCaseToNameAttribute(nameAttribute) {
    return nameAttribute.split("").reduce((previousValue, currentValue) => {
        return ( "A".charCodeAt() <= currentValue.charCodeAt() && 
                 "Z".charCodeAt() >= currentValue.charCodeAt() )
                    ? previousValue.concat('-', currentValue.toLowerCase())
                    : previousValue.concat(currentValue);
    }, "");
}

function createElement(nameElement, attribute, innerElement) {
    let elementDOM = document.createElement(`${nameElement}`);
    if (elementDOM instanceof HTMLUnknownElement) 
        throw Error(`Назва "${nameElement}" є не валідним тегом.`);

    if (attribute !== undefined) {
        Object.entries(attribute).map(el => {

            if (el[0].includes('className')) {
                elementDOM.setAttribute('class', el[1]);
            } else if (el[0].includes('textContent')){
                elementDOM.textContent = el[1];
            } else if (el[0].includes('style')) {
                Object.entries(el[1]).map(elem => {
                    elementDOM.style.setProperty(`${convertCamelCaseToNameAttribute(elem[0])}`, `${elem[1]}`);
                });
            } else {
                elementDOM.setAttribute(`${convertCamelCaseToNameAttribute(el[0])}`, `${el[1]}`);
            }
        });
    }

    if (innerElement !== undefined) {
        if (Array.isArray(innerElement)) {
            innerElement.map((el) => {
                if (el instanceof HTMLElement && el.nodeType === 1) elementDOM.appendChild(el);
                if (typeof el === 'string') elementDOM.appendChild(document.createTextNode(el));
            });
        }

        if (typeof innerElement === 'string') elementDOM.appendChild(document.createTextNode(innerElement));
    }

    return elementDOM;
};

function render(childElement, parentElement) {
    if (!Array.isArray(parentElement) && 
        parentElement instanceof HTMLElement && 
        childElement instanceof HTMLElement) 
    {
        parentElement.appendChild(childElement);
    }
}

const React = {
    createElement,
    render,
}
  
const app = React.createElement('div', { style: { backgroundColor: 'red' } }, [
                React.createElement('span', undefined, 'Hello world'),
                React.createElement('br'),
                'This is just a text node',
                React.createElement('div', { textContent: 'Text content' }),
            ]);
  
React.render(
    app,
    document.getElementById('root'),
);