import { Animation } from '@ionic/core';

export function myEnterAnimation(AnimationC: Animation, baseEl: HTMLElement): Promise<Animation> {

    const baseAnimation = new AnimationC();

    const backdropAnimation = new AnimationC();
    backdropAnimation.addElement(baseEl.querySelector('ion-backdrop'));

    const WAnimation = new AnimationC();
    WAnimation.addElement(baseEl.querySelector('.popover-wrapper'));
    WAnimation.fromTo('opacity', 0.01, 1);
    
    const ArrowAnimation = new AnimationC();
    ArrowAnimation.addElement(baseEl.querySelector('.popover-arrow'));
    ArrowAnimation.fromTo('opacity', 0, 0);

    const wrapperAnimation = new AnimationC();
    wrapperAnimation.addElement(baseEl.querySelector('.popover-content'));

    wrapperAnimation.beforeStyles({ 'opacity': 1 })
    .fromTo('translateY', '-100%', '0%')

    backdropAnimation.fromTo('opacity', 0.01, 0.4);

    return Promise.resolve(baseAnimation
        .addElement(baseEl)
        .easing('cubic-bezier(0.36,0.66,0.04,1)')
        .duration(400)
        .beforeAddClass('show-modal')
        .add(backdropAnimation)
        .add(WAnimation)
        .add(ArrowAnimation)
        .add(wrapperAnimation));

}
export function myLeaveAnimation(AnimationC: Animation, baseEl: HTMLElement): Promise<Animation> {

    const baseAnimation = new AnimationC();

    const backdropAnimation = new AnimationC();
    backdropAnimation.addElement(baseEl.querySelector('ion-backdrop'));
    console.log(baseEl.querySelector('ion-backdrop'))

    const WAnimation = new AnimationC();
    WAnimation.addElement(baseEl.querySelector('.popover-wrapper'));
    WAnimation.fromTo('opacity', 1, 0.01);
    console.log(baseEl.querySelector('.popover-wrapper'))

    const wrapperAnimation = new AnimationC();
    wrapperAnimation.addElement(baseEl.querySelector('.popover-content'));
    console.log(baseEl.querySelector('.popover-content'))

    wrapperAnimation.beforeStyles({ 'opacity': 1 })
    .fromTo('translateY', '0%', '-100%')

    backdropAnimation.fromTo('opacity', 0.4, 0.01);

    return Promise.resolve(baseAnimation
        .addElement(baseEl)
        .easing('cubic-bezier(0.36,0.66,0.04,1)')
        .duration(400)
        .beforeAddClass('show-modal')
        .add(backdropAnimation)
        .add(WAnimation)
        .add(wrapperAnimation));

}