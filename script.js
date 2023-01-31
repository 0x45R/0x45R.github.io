// Obejrzałem za dużo poradników w ferie zimowe
// i próbowałem w tym pliku powtórzyć wszystko czego się nauczyłem

class Carousel{
  constructor(images, starting_index = 0){
    this.images = images;
    this.carousel_tag = document.createElement('div'); // Tworzy div karuzelki

    // Dodaje klasę carousel do div karuzelki
    this.carousel_tag.classList.add('carousel');

    // Tworzy strukturę karuzelki
    this.carousel_tag.innerHTML = `
     <div class="row">
        <div class="row">
          <i class="ti ti-arrow-big-left"></i>
          <i class="ti ti-arrow-big-left-lines"></i>
        </div>
        <div class="slides">
        </div>
        <div class="row">
          <i class="ti ti-arrow-bar-right"></i>
          <i class="ti ti-arrow-big-right-lines"></i>
        </div>
        </div>
        <div class="row">
            <div class="row button">
            </div>
        </div>
      </div>
    `;
    // Znajduje div z przyciskami (kółeczkami)
    this.button_row = this.carousel_tag.querySelector(".row.button");  

    // Znajduje div z zdjęciami
    this.slides_row = this.carousel_tag.querySelector(".slides");

    // Ustawia limit i obecny indeks
    this.img_index = starting_index;
    this.max_index = images.length-1;
    this.min_index = 0;

    // Znajduje i przypisuje lewy przycisk 
    this.left_button = this.carousel_tag.querySelector(".ti-arrow-big-left");
    this.left_button.addEventListener("click", () => this.change_index(-1));
    
    // Znajduje i przypisuje prawy przycisk
    this.right_button = this.carousel_tag.querySelector(".ti-arrow-big-right");
    this.right_button.addEventListener("click", () => this.change_index(1));

    // Znajduje i przypisuje przycisk startu
    this.start_button = this.carousel_tag.querySelector(".ti-arrow-bar-left");
    this.start_button.addEventListener("click", () => this.set_index(this.min_index));

    // Znajduje i przypisuje przycisk końca
    this.end_button = this.carousel_tag.querySelector(".ti-arrow-bar-right");
    this.end_button.addEventListener("click", () => this.set_index(this.max_index));

    this.images.forEach((current, i) =>{
        // Tworzy zdjęcie
        let current_img = document.createElement('img');
        
        // Wyciąga z listy src zdjęć i ustawia je jako atrybut src zdjęcia
        current_img.setAttribute("src", current)

        // Dodaje zdjęciu klasę slide
        current_img.classList.add('slide');

        // Dodaje zdjęcie
        this.slides_row.appendChild(current_img);

        // Tworzy kółka
        let circle = document.createElement('i');

        // Dodaje klasy do kółek 
        circle.classList.add('ti');

        // Dodaje eventlistener do kółek
        circle.addEventListener("click", () => this.set_index(i));
        
        // Dodaj kreskowane kółko
        circle.classList.add('ti-circle-dotted');
        
        // Dodaje kółko
        this.button_row.appendChild(circle);
      }
    )

    // Pokazuje zdjęcie o indeksie img_index
    this.show_image(this.img_index);
  }

  limit_index(index){
    // Limituje wartość index 
    if(index > this.max_index){
      return this.min_index;
    }
    else if(index < this.min_index){
      return this.max_index;
    }
    console.log(index)
    return index;
  }

  set_index(index){
    // Zmienia img_index na uregulowaną wartość
    this.img_index = this.limit_index(index);
    // Pokazuje zdjęcie o indeksie img_index
    this.show_image(this.img_index);
  }

  change_index(index){
    this.set_index(this.img_index + index); 
  }

  show_image(index){
    // Wybiera przycisk z kółkiem pełnym
    let current_circle = this.button_row.querySelector(".ti-circle");
    
    // Jeżeli przycisk z pełnym kółkiem istnieje
    if(current_circle){
      // Dodaje mu kółko kreskowane i usuwa pełne
      current_circle.classList.add('ti-circle-dotted');
      current_circle.classList.remove('ti-circle');
    }

    // Wybiera przycisk z kółkiem kreskowanym i indeksem "index"
    let new_circle = this.button_row.querySelectorAll(".ti-circle-dotted")[index];
    
    // Dodaje mu kółko pełne i usuwa kreskowane
    new_circle.classList.add('ti-circle');
    new_circle.classList.remove('ti-circle-dotted');

    // Wybiera "aktywne" zdjęcie
    let current_img = this.slides_row.querySelector(".active");

    // Jeżeli "aktywne" zdjęcie istnieje
    if(current_img){
      // Usuwa mu klasę active
      current_img.classList.remove("active");
    }

    // Dodaje klasę active zdjęciu o indeksie "index"
    let new_img = this.slides_row.querySelectorAll(".slide")[index];
    new_img.classList.add("active");

  }
}

let placeholder = new Carousel([
  "https://via.placeholder.com/1000",
  "https://via.placeholder.com/320x420",
  "https://via.placeholder.com/1080x1920",
  "https://via.placeholder.com/5280x2034",
  "https://via.placeholder.com/890x529"
], starting_index=4); // Tworzy nową karuzelkę z zdjęciami i przypisuje ją do zmiennej placeholder

document.body.appendChild(placeholder.carousel_tag); // Dodaje gotową karuzelkę do <body>

// To samo tutaj
let second_placeholder = new Carousel(["https://via.placeholder.com/1000", "https://via.placeholder.com/960x120", "https://via.placeholder.com/3000x2000"], starting_index=1);
document.body.appendChild(second_placeholder.carousel_tag);

