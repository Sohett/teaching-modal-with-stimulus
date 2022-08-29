module ApplicationHelper
  def modal(modal_btn_content, &block)
    render(
      partial: 'shared/modal',
      locals: { modal_btn_content: modal_btn_content, block: block }
    )
  end
end
