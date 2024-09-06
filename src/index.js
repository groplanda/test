import './index.scss';
import { header } from './assets/js/header';
import WOW from 'wowjs';
import { faq, hero, phoneMask, points, reviews, tabs } from './assets/js/base';
import MicroModal from 'micromodal';
import contactForm from './assets/js/plugins/ContactForm';

document.addEventListener('DOMContentLoaded', function() {

    header();

    points();

    hero();

    faq();

    tabs();

    reviews();

    new WOW.WOW().init();

    window.MicroModal = MicroModal.init({
        onShow: modal => console.info(`${modal.id} is shown`),
        onClose: modal => console.info(`${modal.id} is hidden`),
        openTrigger: 'data-modal-open',
        openClass: 'active',
        disableScroll: true,
        disableFocus: false,
        awaitOpenAnimation: true,
        awaitCloseAnimation: true,
        debugMode: true
    });

    contactForm();
    
    phoneMask();
});