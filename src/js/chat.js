import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';

gsap.registerPlugin(ScrollTrigger, Flip);

export default function chat() {
    const consultation = document.querySelector('.consultation');
    if (!consultation) return;

    const messages = Array.from(consultation.querySelectorAll('.to-reveal'));
    const messagesContainer = consultation.querySelector('.consultation__chat-messages');
    const dots = consultation.querySelector('.consultation__chat-message.dots');
    let entered = false;

    messages.forEach(message => {
        message.style.display = 'none';
    });

    const showMessages = () => {
      
        setTimeout(() => {
           
            const currentMessage = messages.shift();
            if (currentMessage) {
                const state = Flip.getState(messagesContainer);
                if (dots) dots.remove();
                gsap.set(currentMessage, {
                    display: 'block'
                });
                
                Flip.from(state, {
                    ease: 'power1.inOut',
                    duration: 0.2,
                    onComplete: () => {
                        ScrollTrigger.refresh();
                    }
                }).to(
                    currentMessage,
                    {
                        autoAlpha: 1,
                        duration: 0.2,
                        y: 0
                    },
                    0
                );
            }

            showMessages();
        }, 1000);
    };

    ScrollTrigger.create({
        trigger: consultation,
        start: 'bottom bottom',
        onEnter: () => {
            if (entered) return;
            const state = Flip.getState(messagesContainer);
            dots.style.display = 'block';

            Flip.from(state, {
                ease: 'power1.inOut',
                duration: 0.2,
                onComplete: () => {
                    ScrollTrigger.refresh();
                }
            }).to(
                dots,
                {
                    autoAlpha: 1,
                    duration: 0.2,
                    y: 0
                },
                0
            ).then(() => {
                showMessages();
            })
        }
    });

    ScrollTrigger.refresh();

    console.log('Messages', messages);
}
