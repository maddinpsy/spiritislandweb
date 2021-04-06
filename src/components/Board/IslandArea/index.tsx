import * as React from "react";

import { SpiritIslandState } from "Game";
import style from "./style.module.scss";
import createPanZoom, { PanZoom } from "panzoom";
import { Button } from "components/Button";
import alignCenterImg from "assets/router.svg"
import board from "assets/boards.png"

export interface IslandAreaProps 
{

}

export class IslandArea extends React.Component<IslandAreaProps> {
    ref:React.RefObject<HTMLDivElement>
    panZoomObject:PanZoom | undefined

    constructor(props:IslandAreaProps){
        super(props);
        this.ref=React.createRef();
    }

    componentDidMount(){
        if(this.ref.current){
            this.panZoomObject = createPanZoom(this.ref.current)
        }
    }

    resetPanZoom(){
        if(this.panZoomObject){
            this.panZoomObject.zoomAbs(0,0,1);
            this.panZoomObject.moveTo(0,0);
        }
    }

    render() {
        return (
            <div className={style.IslandArea__container}>
            <img className={style.IslandArea__centerViewButton} src={alignCenterImg} alt="center" onClick={()=>this.resetPanZoom()}/>
            <div ref={this.ref} className={style.IslandArea__panandzoom}>
                <img src={board} />
                <Button 
                onPointerDown={()=>this.panZoomObject?.pause()} 
                onPointerUp={()=>this.panZoomObject?.resume()}
                onClick={()=>this.panZoomObject?.resume()}
                onPointerOut={()=>this.panZoomObject?.resume()}
                >Test</Button>
            </div>
            </div>
        );
    }
}
