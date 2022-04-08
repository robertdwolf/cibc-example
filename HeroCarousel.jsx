import React, { useState, useEffect } from 'react'

import ReactPlayer from 'react-player'
import { useDispatch, useSelector } from 'react-redux'
import { animateScroll as scroll } from 'react-scroll'
import Slider from 'react-slick'
import styled from 'styled-components'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import { updateHeaderLogo } from '../../../_actions'
import { useEventListener } from '../../../_helpers'
import { HeaderText1, HeaderText4, BodyText1, colors, devices } from '../../Common'

export const HeroCarousel = ({ slides }) => {
    const dispatch = useDispatch()
    const { responsiveState } = useSelector(state => state.content)
    const [imageOffset, setImageOffset] = useState(0)
    const [scrollButtonAnimate, setScrollButtonAnimate] = useState(true)

    const settings = {
        dots: false,
        infinite: true,
        arrows: false,
        autoplay: true,
        pauseOnHover: false,
        speed: 1000,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplaySpeed: 10000,
    }

    useEffect(() => {
        dispatch(updateHeaderLogo('light'))
    }, [])

    useEventListener('scroll', () => {
        const scroll_top = document.documentElement.scrollTop || document.body.scrollTop;

        window.requestAnimationFrame(() => {
            setImageOffset(scroll_top * .2)
            setScrollButtonAnimate(window.innerHeight > scroll_top)
        })
    })

    return (
        <HeroWrap className='menuBtnElement' height={responsiveState.windowHeight}>
            <Slider {...settings}>
                {slides.map((slide, index) => (
                    <Slide key={index} thumbnail={slide.image} height={responsiveState.windowHeight}>
                        <TextContent>
                            {slide.title &&
                                <Title serif={true}>{slide.title}</Title>
                            }
                            {slide.body &&
                                <Description dangerouslySetInnerHTML={{ __html: slide.body }} />
                            }
                            {slide.button_text && slide.button_hover_text && (
                                <QuestionButton>
                                    <div>
                                        <label>{slide.button_text}</label>
                                        <label>{slide.button_hover_text}</label>
                                    </div>
                                    <span />
                                </QuestionButton>
                            )}
                        </TextContent>

                        {slides.length > 1 && (
                            <IndexCounter>{`${index + 1}/${slides.length}`}</IndexCounter>
                        )}

                        <ImageWrap>
                            {slide.video_url ? (
                                <ReactPlayer
                                    url={slide.video_url}
                                    playing={true}
                                    muted
                                    autoPlay={true}
                                    loop={true}
                                    height="100vh"
                                    width="100vw"
                                    controls={false}
                                />
                            ) : (
                                <Image image={slide.image} mobile={slide.mobile_image} imageOffset={imageOffset} />
                            )}
                        </ImageWrap>
                    </Slide>
                ))}
            </Slider>

            <ScrollButtonWrap>
                <ScrollButton
                    visible={scrollButtonAnimate}
                    onClick={() => scroll.scrollTo(window.innerHeight, {
                        duration: 500,
                        smooth: true,
                    })}
                >Scroll Down</ScrollButton>
            </ScrollButtonWrap>
        </HeroWrap>
    )
}

const HeroWrap = styled.div`
    position: relative;
    overflow: hidden;
    .slick-track {
        display: flex !important;
    }
    .slick-slide {
        height: ${props => props.height}px;
        float: none !important;
    }
`

const Slide = styled.div`
    width: 100%;
    height: ${props => props.height}px;
    overflow: hidden;
    position: relative;
    z-index: 1;
    padding: 200px 60px 0;
    &:before {
        content: "";
        display: block;
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        z-index: 1;
        background: ${colors.black};
        opacity: .25;
        transform: translate3d(0,0,0);
        pointer-events: none;
    }
    iframe, video {
        box-sizing: border-box;
        height: 56.25vw !important;
        width: 177.77777778vh !important;
        left: 50%;
        min-height: 100%;
        min-width: 100%;
        transform: translate(-50%, -50%);
        position: absolute;
        top: 50%;
        background: center / cover no-repeat url(${({ thumbnail }) => thumbnail});
    }

    @media ${devices.mobile} {
        padding: 160px 20px 0;
    }
`

const ImageWrap = styled.div`
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    clip: rect(0, auto, auto, 0);
`

const Image = styled.div.attrs(({ imageOffset }) => ({
    style: {
        'transform': `translate3d(0,${imageOffset}px,0)`,
    }
}))`
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background: ${colors.grayLight} url(${props => props.image}) no-repeat 50% 50%/cover;

    @media ${devices.tablet} {
        background: ${colors.grayLight} url(${props => props.mobile ? props.mobile : props.image}) no-repeat 50% 50%/cover;
    }
`

const TextContent = styled.div`
    width: 100%;
    position: relative;
    z-index: 2;
    transform: translate3d(0,0,0);
    * {
        color: ${colors.white};
    }
`

const Title = styled(HeaderText1)`
    max-width: 500px;
    margin-bottom: 40px;
    color: ${colors.white};
    background: red;
    @media ${devices.mobile} {
        margin-bottom: 20px;
    }
`

const Description = styled(BodyText1)`
    max-width: 500px;
    @media ${devices.mobile} {
        max-width: 325px;
    }
`

const QuestionButton = styled.div`
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${colors.white};
    width: 180px;
    height: 43px;
    margin: 47px 0 0;
    border-radius: 25px;
    font-family: 'NeueMontreal', sans-serif;
    font-size: 13px !important;
    line-height: 1.2;
    font-weight: 400;
    color: ${colors.textBodyGray};
    text-align: center;
    letter-spacing: 0.5px;
    transition: border-radius 0.5s ease-in-out;
    cursor: pointer;

    div {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        margin: 0 !important;
        transition: left 0.5s ease-in-out, transform 0.5s ease-in-out;

        label {
            white-space: nowrap;
            cursor: pointer;
            color: ${colors.textBodyGray};

            &:first-child {
                display: block;
            }

            &:nth-child(2) {
                display: none;
            }
        }
    }

    span {
        position: absolute;
        right: -5px;
        width: 13px;
        height: 13px;
        background: url('/static/images/arrow-right.svg') no-repeat;
        background-size: 100%;
        opacity: 0;
        transition: opacity 0.5s ease-in-out, right 0.5s ease-in-out;
    }

    &:hover {
        border-radius: 0;

        div {
            left: 13px;
            transform: translateX(0);

            label {
                &:first-child {
                    display: none;
                }

                &:nth-child(2) {
                    display: block;
                }
            }
        }

        span {
            opacity: 1;
            right: 13px;
        }
    }
`

const IndexCounter = styled(HeaderText4)`
    position: absolute;
    left: 60px;
    bottom: 24px;
    z-index: 1;
    color: ${colors.white};
    letter-spacing: 2px;
    @media ${devices.mobile} {
        left: 20px;
    }
`

const ScrollButtonWrap = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    position: absolute;
    bottom: 20px;
    left: 0;
    z-index: 2;
`

const ScrollButton = styled.div.attrs(({ visible }) => ({
    style: {
        'animationPlayState': visible ? 'running' : 'paused',
    }
}))`
    @keyframes pulse {
        0% {
            transform: translate3d(0,-8px,0);
        }
        6% {
            transform: translate3d(0,-8px,0);
        }
        55% {
            transform: translate3d(0,8px,0);
        }
        60% {
            transform: translate3d(0,8px,0);
        }
        100% {
            transform: translate3d(0,-8px,0);
        }
    }
    display: table;
    padding: 5px;
    text-transform: uppercase;
    font-size: 12px;
    letter-spacing: .5px;
    color: ${colors.white};
    transform: translate3d(0,-8px,0);
    animation: pulse 2.5s infinite;
    cursor: pointer;
`
