module Jekyll
  class ActiveLink < Liquid::Tag
    def render(context)
        return context.environments.first["page"]["category"] == context[@markup.strip] ? ' disabled' : ''
    end
  end
end

Liquid::Template.register_tag('active_link', Jekyll::ActiveLink)
