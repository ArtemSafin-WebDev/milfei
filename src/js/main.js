import './lazyload';
import detectTouch from './detectTouch';
import setScrollbarWidth from './setScrollbarWidth';
import masks from './masks';
import validation from './validation';
import anchorLinks from './anchorLinks';
import accordions from './accordions';
import modals from './modals';
import tabs from './tabs';
import menu from './menu';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import servicesSlider from './servicesSlider';
import servicesFilter from './servicesFilter';
import forms from './forms';
import tagsCloud from './tagsCloud';
import showMoreTags from './showMoreTags';
import maps from './map';
import fancybox from './fancybox';
import chat from './chat';
import selectService from './selectService';
import storiesSlider from './storiesSlider';
import fixedHeader from './fixedHeader';
import favourites from './favourites';

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', function () {
    detectTouch();
    fixedHeader();
    setScrollbarWidth();
    masks();
    validation();
    anchorLinks();
    accordions();
    modals();
    tabs();
    menu();
    favourites();
    servicesSlider();
    servicesFilter();
    forms();
    tagsCloud();
    showMoreTags();
    maps();
    fancybox();
    chat();
    selectService();
    storiesSlider();
   
   
});

document.addEventListener('lazyloaded', () => {
    ScrollTrigger.refresh();
});

window.addEventListener('load', function () {
    document.body.classList.add('loaded');
    ScrollTrigger.refresh();
    setTimeout(() => document.body.classList.add('animatable'), 300);
});
