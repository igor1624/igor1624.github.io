import "./style-rule-animations.css";

interface StyleRuleAnimation {
  styleRule: string;
  from: any;
  to: any;
  duration: number;
  onComplete?: Function;
}

// StyleRuleAnimations

class StyleRuleAnimations {

  static animationDescriptors: AnimationDescriptor[] = [];

  static fire(htmlElement: HTMLElement, styleRuleAnimation: StyleRuleAnimation) {

    let animationDescriptor: AnimationDescriptor | null = null;
    for (let i = 0; i < this.animationDescriptors.length; i++) {
      animationDescriptor = this.animationDescriptors[i];
      if (animationDescriptor.htmlElement !== htmlElement) {
        animationDescriptor = null;
        continue;
      }
      if (animationDescriptor.styleRule !== styleRuleAnimation.styleRule) {
        animationDescriptor = null;
        continue;
      }
      break;
    }

    if (!animationDescriptor) {
      animationDescriptor = new AnimationDescriptor(
        htmlElement,
        styleRuleAnimation.styleRule,
        styleRuleAnimation.from,
        styleRuleAnimation.to,
        styleRuleAnimation.duration,
        styleRuleAnimation.onComplete
      );
      this.animationDescriptors.push(animationDescriptor);
    } else {
      animationDescriptor.from = styleRuleAnimation.from;
      animationDescriptor.to = styleRuleAnimation.to;
      animationDescriptor.onComplete = styleRuleAnimation.onComplete;
      animationDescriptor.startedTime = new Date().getTime();
    }

    const performAnimation = () => {
      let i = 0;
      const currentTime = new Date().getTime();
      while (i < this.animationDescriptors.length) {
        animationDescriptor = this.animationDescriptors[i];
        if (animationDescriptor.setCurrentStyleRuleValue(currentTime)) {
          this.animationDescriptors.splice(i, 1);
          if (animationDescriptor.onComplete) {
            animationDescriptor.onComplete();
          }
          continue;
        }
        i++;
      }
      if (this.animationDescriptors.length > 0) {
        requestAnimationFrame(performAnimation);
      }
    };

    if (this.animationDescriptors.length > 0) {
      requestAnimationFrame(performAnimation);
    }
  }
}

//  AnimationDescriptor

class AnimationDescriptor {

  htmlElement: HTMLElement;
  styleRule: string;
  from: any;
  to: any;
  $value: any;
  duration: number;
  onComplete?: Function;
  startedTime = 0;

  constructor(htmlElement: HTMLElement, styleRule: string, from: any, to: any, duration: number, onComplete?: Function) {
    this.htmlElement = htmlElement;
    this.styleRule = styleRule;
    this.from = from;
    this.to = to;
    this.$value = this.from;
    this.duration = duration * 1000;
    this.onComplete = onComplete;
    this.startedTime = new Date().getTime();
    this.htmlElement.classList.add("-style-rule-animation");
  }

  setCurrentStyleRuleValue(currentTime: number) {
    if (typeof this.$value === "number") {
      if (this.duration <= 0) {
        // end of animation
        this.setStyleRuleValue();
        this.htmlElement.classList.remove("-style-rule-animation");
        return true;
      }
      this.$value = this.from + (this.to - this.from) * ((currentTime - this.startedTime) / this.duration);
      if (this.from < this.to) {
        if (this.$value >= this.to) {
          this.$value = this.to;
          this.setStyleRuleValue();
          this.htmlElement.classList.remove("-style-rule-animation");
          return true;
        }
      } else if (this.$value <= this.to) {
        this.$value = this.to;
        this.setStyleRuleValue();
        this.htmlElement.classList.remove("-style-rule-animation");
        return true;
      }
      this.setStyleRuleValue();
      return false;
    }
  }

  setStyleRuleValue() {
    if (typeof this.$value === "number") {
      (this.htmlElement.style as any)[this.styleRule] = this.$value.toString();
    }
  }
}

export default StyleRuleAnimations;
