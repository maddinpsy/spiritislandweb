import { eventNames } from "process";
import React, { Component, useRef } from "react"

export interface SelectableProps {
    isSelected: boolean
    selRef: React.RefObject<HTMLDivElement>
}

export function SelectableDivHOC<T>
    (WrappedComponent: React.ComponentType<T & SelectableProps>) {
    // Try to create a nice displayName for React Dev Tools.
    const displayName =
        WrappedComponent.displayName || WrappedComponent.name || "Component";



    class SelectableComponent extends Component<T, { isSelected: boolean }>
    {
        selRef: React.RefObject<HTMLDivElement>
        static displayName = 'selectable(' + displayName + ')';
        constructor(props: any) {
            super(props)
            this.selRef = React.createRef();
            this.state = { isSelected: false }
            this.select = this.select.bind(this);
            this.unselect = this.unselect.bind(this);
        }
        select() {
            this.setState({ isSelected: true });
        }
        unselect(ev:FocusEvent) {
            //only do unselect, if relatedTarget(clicked on), is not a child of current target (selected)
            if (!ev.relatedTarget || ev.currentTarget && !(ev.currentTarget as Node).contains(ev.relatedTarget as Node)) {
                this.setState({ isSelected: false })
            }
        }
        componentDidMount() {
            if (this.selRef.current) {
                //unselect handcard when loosing focus
                this.selRef.current.onblur = this.unselect;
                //but not if child has still the focus, onBlur is called first
                this.selRef.current.onfocus = () => this.select();
                //onBlur only works if tabIndex is set
                this.selRef.current.tabIndex = 1;
            }
        }

        render() {
            // Fetch the props you want to inject. This could be done with context instead.
            const injectedProps = {
                isSelected: this.state.isSelected,
                selRef: this.selRef
            }

            // props comes afterwards so the can override the default ones.
            return <WrappedComponent {...injectedProps} {...(this.props)} />;
        }
    };



    return SelectableComponent;
}