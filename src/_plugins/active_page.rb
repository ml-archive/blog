module Jekyll
  class ActivePage < Liquid::Tag
    def render(context)
        return context.environments.first["page"]["category"] == context[@markup.strip] ? ' active' : ''
    end
  end
end

Liquid::Template.register_tag('active_page', Jekyll::ActivePage)
