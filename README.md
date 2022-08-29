# Create a Modal with Stimulus and Rails

- first create a new rails app with the `devise-template` from le-wagon
```bash
rails new \
  -d postgresql \
  -j webpack \
  -m https://raw.githubusercontent.com/lewagon/rails-templates/master/devise.rb \
  rails-modal-stimulus
```
- add the [scss for the exercice](https://github.com/Sohett/teaching-modal-with-stimulus#scss-code-for-the-exercice) and import it.
- start coding 🚀


## 1. Create an HTML modal
```html
<div>
  <!-- Outside of the modal to trigger the opening -->
  <button class="stimulus-modal-btn">Open modal</button>

  <!-- The Modal itself -->
  <div class="stimulus-modal-container">

    <!-- Modal content -->
    <div class="stimulus-modal-content">
      <span class="close-modal-icon">&times;</span>
      <p>Inside the modal</p>
    </div>
  </div>
</div>
```

## 2. Refacto it so that you can use it anywhere and pass a block
### 2.1 use of shared/partial
- put in a partial in `shared/_modal.html.erb`
- make it so that it's using dynamic values from `locals` instead of the `Open modal` content and the `<p>Inside the modal</p>` content
## 2.2 use the power of rails view helpers
- use the magic of procs to pass a `&block` (close to what a yield is)
```ruby
def modal(modal_btn_content, &block)
  render(
    partial: 'shared/modal',
    locals: { modal_btn_content: modal_btn_content, block: block }
  )
end
```
- replace the second argument by `<%= capture(&block) %>` and pass a block instead in the call of the method
- this gives us now the possibility to use it like a helper in our `view`
```html
<%= modal('content that will be displayed in the button') do |t| %>
  <!-- whatever block you want. For ex: <p>test</p> -->
<% end %>
```

## 3. Use the power of Stimulus to make it work now
### 3.1 create a Stimulus controller
- `rails generate stimulus modal`
- embed the controller in the HTML page in the parent `div` of `modal` partial
- `<div data-controller="modal">`

### 3.2 add all the targets to catch the HTML elements you need
- `data-modal-target="modal"`

### 3.3 add the actions you need to change the behaviour of the partial
- when clicking on buttong -> opening the modal: `data-action="click->modal#openModal"`
- when clicking on the `x` icon -> closing the modal: `data-action="click->modal#closeModal"`
- a nice to have is the escape button that will close the modal: `data-action="keyup@window->modal#closeWithKeyboard"`

### 3.4 add the methods in the stimulus controller to make it dynamic
- `static targets = ["modal"];`
- open the modal
```js
openModal() {
  this.modalTarget.style.display = "block";
};
```
- close the modal
```js
closeModal() {
  this.modalTarget.style.display = "none";
};
```

- close with the keyboard
```js
closeWithKeyboard(e) {
  if (e.code == "Escape") {
    this.closeModal();
  };
};
```

___

### final code:
- `shared/_modal`
```html
<div
  data-controller="modal"
  data-action="keyup@window->modal#closeWithKeyboard"
>
  <button
    data-action="click->modal#openModal"
    class="stimulus-modal-btn">
    <%= modal_btn_content %>
  </button>

  <!-- The Modal -->
  <div
    data-modal-target="modal"
    class="stimulus-modal-container">

    <!-- Modal content -->
    <div class="stimulus-modal-content">
      <span
        class="close-modal-icon"
        data-action="click->modal#closeModal">
        &times;
      </span>
      <%= capture(&block) %>
    </div>
  </div>
</div>
```

- `application_helper.rb`
```ruby
module ApplicationHelper
  def modal(modal_btn_content, &block)
    render(
      partial: 'shared/modal',
      locals: { modal_btn_content: modal_btn_content, block: block }
    )
  end
end
```

- `modal_controller.js`

```js
import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="modal"
export default class extends Controller {
  static targets = ["modal"];

  openModal() {
    this.modalTarget.style.display = "block";
  };

  closeModal() {
    this.modalTarget.style.display = "none";
  };

  closeWithKeyboard(e) {
    if (e.code == "Escape") {
      this.closeModal();
    };
  };
}
```

### scss code for the exercice
```scss
.stimulus-modal-btn {
  padding: 10px 15px;
  background-color: #4816d3;
  color: white;
  border-radius: 8px;
  border: none;
}

.stimulus-modal-container {
  display: none;
  position: fixed;
  z-index: 1;
  padding-top: 30vh;
  left: 0;
  top: 0;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  height: 100%;
  overflow: auto;
}

.stimulus-modal-content {
  border-radius: 8px;
  background-color: #fefefe;
  margin: auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
}

.close-modal-icon {
  color: #aaaaaa;
  float: right;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
}
```
