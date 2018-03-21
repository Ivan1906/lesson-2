function createElement(nameElement, attribute, innerElement) {
    let elementDOM = document.createElement(`${nameElement}`);

    if (attribute !== undefined) {
        Object.entries(attribute).map(el => {
            if (el[0].includes('className')) {
                elementDOM.setAttribute('class', el[1]);
            } else if (el[0].includes('style')) {
                debugger;
                Object.entries(el[1]).map(elem => {
                    elementDOM.style.setProperty(`${elem[0]}`, `${elem[1]}`)
                    console.log(elementDOM.style.backgroundColor);
                });
            } else {
                elementDOM.setAttribute(`${el[0]}`, `${el[1]}`);
            }
        });
    }

    return elementDOM;
};

function render() {}

const React = {
    createElement,
    render,
}
  
const app = React.createElement('h1', {className: 'one', 
                                        id: 'non', 
                                        style: {'background-color': 'red', borderColor: 'black'}
                                    });

/*const app = React.createElement('div', { style: { backgroundColor: 'red' } }, [
        React.createElement('span', undefined, 'Hello world'),
        React.createElement('br'),
        'This is just a text node',
        React.createElement('div', { textContent: 'Text content' }),
    ]);*/
  
/*React.render(
    app,
    document.getElementById('root'),
);*/
document.getElementById('root').appendChild(app);