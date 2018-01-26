import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';

const { Component } = React;

class Dropdown extends Component {
    state = {
        position: null,
    };

    calculatePosition() {
        // some position calc code based on this.props.element
        const position = {/* stub */top: 0, left: 0};

        this.setState({
            position,
            active: true,
        });
    }

    render() {
        const { children, onClose } = this.props;

        this.calculatePosition();

        return (
            <div className='dropdown'>
                <button className='dropdown__close' onClick={onClose}></button>
                {children}
            </div>
        );
    }
}

class Menu extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            dropdown: false,
            menu: props.menu.items,
            dropdownItemsCount: 0,
        };
    }

    componentDidMount() {
        window.addEventListener('resize', () => {
            this.setState({
                dropdownItemsCount: 0,
            });
        });
        this.checkRecalculation();
    }

    componentDidUpdate() {
        this.checkRecalculation();
    }

    checkRecalculation() {
        const { dropdownItemsCount } = this.state;
        Object.keys(this.refs).find((key) => {
            if (this.refs[key].offsetTop > 0) {
                this.setState({
                    dropdownItemsCount: dropdownItemsCount + 1,
                });
            }
        });
    }

    render() {
        const { dropdownItemsCount, menu, dropdown } = this.state;

        function SomeLink({link, children}) {
            return (
                <div>
                    <a href={link} className='link'>
                        {children}
                    </a>
                </div>
            );
        }

        return (
            <div className='menu' ref={el => this.element = el}>
                {
                    menu.slice(0, menu.length - dropdownItemsCount).map((menuItem, index) => (
                        <div
                            className='menu__item'
                            key={index}
                            ref={`menu__${index}`}
                        >
                            <SomeLink link={menuItem.link}>
                                {menuItem.text}
                            </SomeLink>
                        </div>
                    ))
                }
                {
                    dropdownItemsCount !== 0 && <button onClick={() => this.setState({dropdown: !dropdown})}>Show menu</button>
                }
                {
                    dropdown &&
                    <Dropdown
                        element={this.element}
                        onClose={() => this.setState({dropdown: !this.state.dropdown})}>
                        {
                            menu.slice(menu.length - dropdownItemsCount, menu.length).map((menuItem, index) => (
                                <SomeLink link={menuItem.link} key={index}>
                                    {menuItem.text}
                                </SomeLink>
                            ))
                        }
                    </Dropdown>
                }
            </div>
        );
    }
}

ReactDOM.render(
    <Menu menu={{items: [
        {
            link: '#a',
            text: 'Первая ссылка',
            id: 'first'
        },
        {
            link: '#ab',
            text: 'Вторая ссылка',
            id: 'second'
        },
        {
            link: '#abc',
            text: 'Третья ссылка',
            id: 'third'
        },
        {
            link: '#contacts',
            text: 'Контакты',
            id: 'contacts'
        },
    ]}}>
    </Menu>,
    document.getElementById('root')
);
