const navigation_buttons = document.querySelectorAll(".navigation-button")
navigation_buttons.forEach((current) => {current.addEventListener("click",()=>{alert("Nie chce mi się robić przycisków :c")})})

const scrollable_container = document.querySelector(".navigation-scrollable-container")
var scroll_hover_effect = (Array.from(scrollable_container.childNodes)).concat(scrollable_container)


var scroll_speed = -4
var previous_speed = scroll_speed

const scroll = (element) => {
  percentage = (element.scrollLeft / (element.scrollWidth - element.clientWidth));
  percentage = percentage.toPrecision(2);
  if(percentage == 1 || percentage == 0){
    scroll_speed = scroll_speed * -1
  }
  element.scrollBy({
    top: 0,
    left: scroll_speed,
    behavior: 'smooth'
  });
}

const start_scrolling = () => {
  scroll_speed = previous_speed
}

const stop_scrolling = () => {
  previous_speed = scroll_speed
  scroll_speed = 0
}

var scroll_interval = setInterval(scroll, 100, scrollable_container)

scroll_hover_effect.forEach((child)=>{
  child.addEventListener("mouseenter", stop_scrolling)
  child.addEventListener("mouseout", start_scrolling)
})
