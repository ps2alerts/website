import { FacilityType, MAJOR_FACILITIES } from "~/constants/FacilityType";
import { MAP_FACTION_COLORS } from "~/constants/FactionMapColors";
import { SVG, Svg } from "@svgdotjs/svg.js";
import "@svgdotjs/svg.filter.js";  
import { Point } from "./mapping/MapDrawingInterface";
import { MapRegion } from "~/libraries/MapRegion";
import facilityTypeName from "~/filters/FacilityTypeName";
import { Faction } from "~/constants/Faction";

const FONT_OPTIONS = {
    family: "sans-serif",
    size: 60,
    anchor: "middle",
    leading: 1.1
};

export class FacilityBadge {
    indicatorStamp: number;
    textStamp: number;
    type: FacilityType;
    region: MapRegion;
    private svg: Svg;
    private svgBuilt: boolean;
    private text: Svg;
    private textBuilt: boolean;
    private hovered: boolean;

    constructor(region: MapRegion, indictorStamp: number, textStamp: number){
        this.indicatorStamp = indictorStamp;
        this.textStamp = textStamp;
        this.type = region.facilityType;
        this.svg = SVG();
        this.svg.viewbox(0, 0, 100, 100);
        this.text = SVG();
        this.text.viewbox(0, 0, 100, 100);
        this.svgBuilt = false;
        this.textBuilt = false;
        this.region = region;
        this.hovered = false;
    }

    private buildText(value: string): Svg {
        //var defs = this.svg.defs();
        switch (this.region.facilityType){
            case FacilityType.AMP_STATION:
            case FacilityType.BIO_LAB:
            case FacilityType.TECH_PLANT:
                value = value + "\n" + facilityTypeName(this.region.facilityType);
                break;
            case FacilityType.CONTAINMENT_SITE:
                value = value.replaceAll(" ", "\n");
                break;
            case FacilityType.TRIDENT:
                break;
            case FacilityType.INTERLINK_FACILITY:
                if(value.indexOf(" ") >= 7){
                    value = value.replace(" ", "\n");
                }
                break;
            default:
                var matches_length = value.match(/ /g)?.length;
                if(matches_length !== undefined && matches_length > 1){
                    value = value.slice(0, value.indexOf(" ", value.indexOf(" ") + 1)) + "\n" + value.slice(value.indexOf(" ", value.indexOf(" ") + 1) + 1);
                } else if(value.length > 16){
                    value = value.replace(" ", "\n");
                }
                if(value.indexOf("\n") > 14 && value.indexOf(" ") >= 7){
                    value = value.replace(" ", "\n");
                }
                break;
        }
        this.text.viewbox(0, 0, 100, 100);
        var text = this.text.text((add) => {
            value.split("\n").forEach((substr) => {
                add.tspan(substr);
            });
        });
        
        var text2 = this.text.text((add) => {
            value.split("\n").forEach((substr) => {
                add.tspan(substr);
            });
        });

        text.addClass("map-region");
        text2.addClass("map-region");

        text.font(FONT_OPTIONS);
        text2.font(FONT_OPTIONS);
        text.stroke({ color: MAP_FACTION_COLORS[this.region.faction].toString(),
            opacity: 1,
            width: 15
        });
        text.fill(MAP_FACTION_COLORS[this.region.faction].toString());
        text.filterWith((add) => {
            add.gaussianBlur(5, 5);
        });
        var height = text.bbox().height;
        text.children().forEach((tspan, index) => {
            if(index > 0){
                tspan.dy(height * text.leading().value);
            }
            tspan.cx(0);
        });
        text2.children().forEach((tspan, index) => {
            if(index > 0){
                tspan.dy(height * text.leading().value);
            }
            tspan.cx(0);
        })
        this.text.viewbox(text.bbox().x, -text.bbox().h, text.bbox().w + 20, 100 + text.bbox().h * 2);
        //this.svg.get(0).move(this.svg.viewbox().cx - 50, this.svg.viewbox().cy - 50);
        //this.svg.get(1).move(this.svg.viewbox().cx - 50, this.svg.viewbox().cy - 50);
        
        text.move(this.text.viewbox().cx - text.bbox().w / 2, this.text.viewbox().cy + 50);
        
        text2.move(this.text.viewbox().cx - text.bbox().w / 2, this.text.viewbox().cy + 50);
        text2.fill("white");
        this.textBuilt = true;
        return this.text;
    }

    update(zoom: number): void {
        if(!this.svgBuilt){
            this.getSVG();
        }
        if(!this.textBuilt){
            this.getText();
        }
        var newColor = MAP_FACTION_COLORS[this.region.faction].toString();
        this.svg.get(0).fill(newColor);
        if(this.visibleAtZoom(zoom)){
            this.text.get(0).stroke({color: newColor, opacity: 1}).fill({color: newColor, opacity: 1});
            this.text.get(1).fill({color: "white", opacity: 1});
        } else {
            this.text.get(0).stroke({opacity: 0}).fill({opacity: 0});
            this.text.get(1).fill({opacity: 0});
        }
    }

    setHovered(hovered: boolean, zoom: number): void {
        this.hovered = hovered;
        this.update(zoom);
    }

    ready(): boolean {
        return this.svgBuilt && this.textBuilt;
    }

    getSVG(): SVGSVGElement {
        if(this.svgBuilt){
            return this.svg.node;
        }
        
        this.svg.use("facility-bg", require("~/assets/img/facility-icon.svg"))
            .addClass(this.region.id.toString())
            .fill(MAP_FACTION_COLORS[this.region.faction].toString());

        this.svg.use(FacilityBadge.SVGDefinitionId(this.type), require("~/assets/img/facility-icon.svg"));
        this.svgBuilt = true;
        
        return this.svg.node;
    }

    getText(): SVGSVGElement {
        if(this.textBuilt){
            return this.text.node;
        }
        return this.buildText(this.region.name).node;
    }

    getIcon(faction: Faction): SVGSVGElement {
        var toReturn = SVG();
        toReturn.viewbox(0, 0, 100, 100);
        toReturn.use("facility-bg", require("~/assets/img/facility-icon.svg")).fill(MAP_FACTION_COLORS[faction].toString());
        toReturn.use(FacilityBadge.SVGDefinitionId(this.type), require("~/assets/img/facility-icon.svg"));
        toReturn.width(38);
        toReturn.height(38);
        return toReturn.node;
    }

    getSize(): Point {
        if(!this.svgBuilt){
            this.getSVG();
        }
        var rad = FacilityBadge.radius(this.type);
        return new Point(rad * 2 * this.svg.viewbox().width / 100, rad * 2 * this.svg.viewbox().height / 100);
    }

    getTextSize(): Point {
        if(!this.textBuilt){
            this.getText();
        }
        var rad = FacilityBadge.radius(this.type);
        return new Point(rad * 2 * this.text.viewbox().width / 100, rad * 2 * this.text.viewbox().height / 100);
    }

    visibleAtZoom(zoom: number){
        if(this.hovered){
            return true;
        }
        if(MAJOR_FACILITIES.some((major) => major === this.type)){
            return true;
        }
        switch(this.type){
            case FacilityType.SMALL_OUTPOST:
            case FacilityType.CONSTRUCTION_OUTPOST:
            case FacilityType.RELIC_OUTPOST:
                return zoom >= 4;
            case FacilityType.LARGE_OUTPOST:
                return zoom >= 3;
            default:
                return false;
        }
    }

    static radius(type: FacilityType): number {
        if(MAJOR_FACILITIES.some((major) => major === type)){
            return 11;
        }
        switch(type){
            case FacilityType.SMALL_OUTPOST:
            case FacilityType.CONSTRUCTION_OUTPOST:
                return 9;
            case FacilityType.LARGE_OUTPOST:
                return 10;
            default:
                return 0;
        }
    }

    static SVGDefinitionId(type: FacilityType): string {
        switch(type){
            case FacilityType.AMP_STATION:
                return "amp-fg";
            case FacilityType.BIO_LAB:
                return "bio-fg";
            case FacilityType.TECH_PLANT:
                return "tech-fg";
            case FacilityType.LARGE_OUTPOST:
                return "lg-outpost-fg";
            case FacilityType.SMALL_OUTPOST:
                return "sm-outpost-fg";
            case FacilityType.WARPGATE:
                return "warpgate-fg";
            case FacilityType.INTERLINK_FACILITY:
                return "interlink-fg";
            case FacilityType.CONSTRUCTION_OUTPOST:
                return "const-outpost-fg";
            case FacilityType.RELIC_OUTPOST:
                return "relic-fg";
            case FacilityType.CONTAINMENT_SITE:
                return "containment-fg";
            case FacilityType.TRIDENT:
                return "trident-fg";
            default:
                return "";
        }
    }
}