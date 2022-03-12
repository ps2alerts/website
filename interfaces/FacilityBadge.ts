import { FacilityType, MAJOR_FACILITIES } from "~/constants/FacilityType";
import { Faction } from "~/constants/Faction";


export class FacilityBadge {
    markerStamp: number;
    type: FacilityType;

    constructor(type: FacilityType, markerStamp: number){
        this.markerStamp = markerStamp;
        this.type = type;
    }

    visibleAtZoom(zoom: number){
        if(MAJOR_FACILITIES.some((major) => major === this.type)){
            return true;
        }
        switch(this.type){
            case FacilityType.SMALL_OUTPOST:
            case FacilityType.CONSTRUCTION_OUTPOST:
            case FacilityType.RELIC_OUTPOST:
                return zoom <= 3;
            case FacilityType.LARGE_OUTPOST:
                return zoom <= 4;
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

    static SVGDefinitionName(type: FacilityType): string {
        switch(type){
            case FacilityType.AMP_STATION:
                return "#amp-fg";
            case FacilityType.BIO_LAB:
                return "#bio-fg";
            case FacilityType.TECH_PLANT:
                return "#tech-fg";
            case FacilityType.LARGE_OUTPOST:
                return "#lg-outpost-fg";
            case FacilityType.SMALL_OUTPOST:
                return "#sm-outpost-fg";
            case FacilityType.WARPGATE:
                return "#warpgate-fg";
            case FacilityType.INTERLINK_FACILITY:
                return "#interlink-fg";
            case FacilityType.CONSTRUCTION_OUTPOST:
                return "#const-outpost-fg";
            case FacilityType.RELIC_OUTPOST:
                return "#relic-fg";
            case FacilityType.CONTAINMENT_SITE:
                return "#containment-fg";
            case FacilityType.TRIDENT:
                return "#trident-fg";
            default:
                return "";
        }
    }
}