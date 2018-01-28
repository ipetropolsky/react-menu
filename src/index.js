import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';

const { Component, PureComponent } = React;

class Dropdown extends PureComponent {

    render() {
        const { items, rightPosition } = this.props;

        return (
            <div
                className='dropdown'
                style={{
                    right: rightPosition
                }}
            >
                {
                    items.map((menuItem) => (
                        <DropdownItem
                            key={menuItem.id}
                            item={menuItem}
                        >
                            {menuItem.text}
                        </DropdownItem>
                    ))
                }
            </div>
        );
    }
}

function SomeLink({link, children, disabled, className, onClick}) {
    const attrs = {
        className: className || 'link',
        // eslint-disable-next-line no-script-url
        href: link || 'javascript:void(0);'
    };
    if (onClick) {
        attrs.onClick = onClick;
    };
    if (disabled) {
        attrs.tabIndex = -1;
        attrs.disabled = true;
    }
    return (
        <a {...attrs}>
            {children}
        </a>
    );
}

class MenuItem extends Component {
    componentWillUnmount() {
        const { removeItemRef, id } = this.props;
        removeItemRef && removeItemRef(id);
    }

    render() {
        const { id, link, hidden, active, addItemRef, onClick, children } = this.props;
        return (
            <div
                className={'menu-item' + (hidden ? ' menu-item_hidden' : '')}
                data-menu-item-id={id}
                ref={addItemRef}
            >
                <SomeLink
                    link={link}
                    disabled={hidden}
                    className={'menu-item__link' + (active ? ' menu-item__link_active' : '')}
                    onClick={onClick}
                >
                    {children}
                </SomeLink>
            </div>
        )
    }
}

function DropdownItem(props) {
    return (
        <div className="menu-item menu-item_wide">
            <SomeLink
                link={props.item.link}
                className='menu-item__link'
            >
                {props.item.text}
            </SomeLink>
        </div>
    )
}

class Menu extends PureComponent {
    itemRefs = {};

    constructor(props, context) {
        super(props, context);

        this.state = {
            visibleItemsCount: props.items.length,
            dropdownRightPosition: 0,
            dropdownVisible: false
        };
    }

    componentDidMount() {
        window.addEventListener('resize', () => {
            this.checkRecalculation();
        });
        this.checkRecalculation();
    }

    componentDidUpdate() {
        this.checkRecalculation();
    }

    checkRecalculation() {
        let visibleItemsWidth = 0;
        let dropdownRightPosition = 0;
        let visibleItemsCount = this.props.items.length;

        const menuWidth = this.element.offsetWidth;
        const moreLinkWidth = this.moreLink.offsetWidth;

        this.props.items.findIndex((item, index) => {
            const itemWidth = this.itemRefs[item.id].offsetWidth;
            // Дополнительное место может понадобиться для кнопки дропдауна
            let additionalWidth = (index === this.props.items.length - 1) ? 0 : moreLinkWidth;
            if (visibleItemsWidth + itemWidth + additionalWidth > menuWidth) {
                visibleItemsCount = index;
                dropdownRightPosition = menuWidth - visibleItemsWidth - moreLinkWidth;
                return true;
            } else {
                visibleItemsWidth += itemWidth;
            }
            return false;
        });

        this.setState({
            visibleItemsCount,
            dropdownRightPosition,
        });
    }

    hideDropdown = () => {
        this.setState({
            dropdownVisible: false
        });
    };

    toggleDropdown = () => {
        this.setState(state => ({
            dropdownVisible: !state.dropdownVisible
        }));
    };

    saveMenuRef = (element) => {
        this.element = element;
    };

    saveMoreLinkRef = (element) => {
        this.moreLink = element;
    };

    addItemRef = (element) => {
        // `element` может быть `null`
        // https://reactjs.org/docs/refs-and-the-dom.html#caveats
        if (element) {
            // Если забиндить id в `props.addItemRef`, ссылка на функцию
            // будет каждый раз меняться. Поэтому прокидываем через атрибуты.
            const id = element.getAttribute('data-menu-item-id');
            this.itemRefs[id] = element;
        }
    };

    removeItemRef = (id) => {
        this.itemRefs[id] = null;
    };

    render() {
        const { items } = this.props;
        const { visibleItemsCount, dropdownRightPosition, dropdownVisible } = this.state;
        const hasDropdown = (visibleItemsCount < this.props.items.length);

        return (
            <React.Fragment>
                <div className='menu' ref={this.saveMenuRef}>
                    {
                        items.map((item, index) => (
                            <MenuItem
                                key={item.id}
                                id={item.id}
                                link={item.link}
                                hidden={index >= visibleItemsCount}
                                addItemRef={this.addItemRef}
                                removeItemRef={this.removeItemRef}
                            >{item.text}</MenuItem>
                        ))
                    }
                    {
                        <MenuItem
                            key='_more'
                            id='_more'
                            hidden={!hasDropdown}
                            active={dropdownVisible}
                            addItemRef={this.saveMoreLinkRef}
                            onClick={this.toggleDropdown}
                        >Ещё…</MenuItem>
                    }
                </div>
                {
                    hasDropdown &&
                    dropdownVisible &&
                    <Dropdown
                        items={items.slice(visibleItemsCount)}
                        rightPosition={dropdownRightPosition}
                        onClose={this.hideDropdown}
                    />
                }
            </React.Fragment>
        );
    }
}

const initialItems = [
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
];

class App extends PureComponent {
    state = {
        items: initialItems
    };

    constructor(props, context) {
        super(props, context);

        window.setTimeout(() => {
            const newItems = initialItems.concat({
                link: '#ee',
                text: 'И ещё ссылка',
                id: 'last'
            });
            newItems[2] = {
                link: '#abcd',
                text: 'Третья ссылка новая',
                id: 'third_new'
            };
            this.setState({
                items: newItems
            });
        }, 5000);
    }

    render() {
        return (
            <Menu items={this.state.items}/>
        )
    }
}

ReactDOM.render(<App/>, document.getElementById('root'));
