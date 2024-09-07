import './index.scss';
import MicroModal from 'micromodal';
import contactForm from './assets/js/contactForm';
import Inputmask from 'inputmask';

document.addEventListener('DOMContentLoaded', function() {

    window.MicroModal = MicroModal.init({
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

    function phoneMask() {
        const phones = document.querySelectorAll('[data-mask="phone"]');
        
        const im = new Inputmask("+7 (999) 999-99-99", {
            showMaskOnHover: false,
        });
    
        phones.forEach((phone) => {
            im.mask(phone);
        });
    }

});