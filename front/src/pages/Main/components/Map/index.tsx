import { FC, useState } from "react";
import { IconLayer } from "@deck.gl/layers";
import { StaticMap } from "react-map-gl";
import { HtmlOverlay, HtmlOverlayItem } from "@nebula.gl/overlays";
import { DeckGL } from "@deck.gl/react";
import { Container } from '../../../../components/UI/Container';
import { Page } from '../../../../components/UI/Page';
import { H2 } from '../../../../components/UI/Heading';
import styled from "styled-components";

const coordinatesData = [
    {
        name: "г. Москва, Москва",
        code: "77",
        address: "3601 глухонемых",
        entries: "3481",
        exits: "3616",
        coordinates: [37.6173, 55.7558]
    },
    {
        name: "г. Майкоп, Республика Адыгея",
        code: "01",
        address: "3452 глухонемых",
        entries: "3481",
        exits: "3616",
        coordinates: [40.1047, 44.6076]
    }
];

const ICON_MAPPING = {
    marker: {
        x: 0,
        y: 0,
        width: 128,
        height: 128,
        anchorY: 128,
        mask: true
    }
};

const ICON_SIZE = 40;
const ICON_COLOR = [80, 140, 0];
const ICON_COLOR_SELECTED = [140, 0, 0];
const ICON_COLOR_HOVERED = [255, 204, 0];

const INITIAL_VIEW_STATE = {
    latitude: 55.7558,
    longitude: 37.6173,
    zoom: 9
};

export const Map: FC = () => {
    const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);

    const [selectedIcon, setSelectedIcon] = useState<any>(null);
    const [hoveredIcon, setHoveredIcon] = useState(null);

    const iconLayer = new IconLayer({
        id: "IconLayer",
        data: coordinatesData,
        getIcon: (d: any) => "marker",
        getPosition: (d: any) => d.coordinates,
        getSize: (d: any) => (d === selectedIcon ? 1.5 : 1) * ICON_SIZE,
        getColor: (d: any) => {
            if (d === selectedIcon) {
                return ICON_COLOR_SELECTED;
            }
            if (d === hoveredIcon) {
                return ICON_COLOR_HOVERED;
            }
            return ICON_COLOR;
        },
        iconAtlas:
            "https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png",
        iconMapping: ICON_MAPPING,
        pickable: true,
        onClick: (info: any, event: any) => {
            console.log("IconLayer onClick");
            if (event.srcEvent.defaultPrevented) {
                return true;
            }
            setSelectedIcon(info.object);
            return true;
        },
        onHover: (info: any, event: any) => {
            if (event.srcEvent.defaultPrevented) {
                return true;
            }
            setHoveredIcon(info.object);
            return true;
        },
        updateTriggers: {
            getColor: [selectedIcon, hoveredIcon],
            getSize: [selectedIcon]
        }
    });

    const layers = [iconLayer];

    const popupOverlay = selectedIcon ? (
        <HtmlOverlay onClick={() => console.log("HtmlOverlay clicked")} key="1">
            <HtmlOverlayItem
                style={{ pointerEvents: "all" }}
                coordinates={selectedIcon.coordinates}
                onClick={() => console.log("HtmlOverlayItem clicked")}
                onPointerUp={(event: any) => event.preventDefault()}
                onMouseMove={(event: any) => event.preventDefault()}
            >
                <div
                    style={{ backgroundColor: "white" }}
                    onClick={() => console.log("HtmlOverlayItem child clicked")}
                >
                    <div>{selectedIcon.name}</div>
                    <div>{selectedIcon.address}</div>
                </div>
            </HtmlOverlayItem>
        </HtmlOverlay>
    ) : null;

    const overlays = [popupOverlay];

    return (
        <>
            <Page id="Map" pBottom>
                <Container>
                    <H2 center>Карта</H2>
                </Container>
                <Container pNone page mtNone
                    style={{

                    }}>
                    <DeckGL
                        viewState={viewState}
                        onViewStateChange={(data: any) => setViewState(data.viewState)}
                        controller={true}
                        layers={layers}
                        onClick={(info: any, event: any) => {
                            console.log("DeckGL onClick");
                            if (event.srcEvent.defaultPrevented) {
                                return;
                            }
                            // Un-select the icon when clicked on the map
                            setSelectedIcon(info.object);
                        }}
                        onHover={(info: any, event: any) => {
                            setHoveredIcon(null);
                        }}
                    >
                        <StaticMap mapStyle="https://d3dt5tsgfu6lcf.cloudfront.net/style/santurce/web" />
                        {overlays}
                    </DeckGL>
                </Container>
            </Page>
        </>
    );
}


const Deck = styled(DeckGL)`
    
`;
