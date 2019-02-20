module Jekyll
  class ActiveUrl < Liquid::Tag
    def initialize(tag_name, input, tokens)
      super
      @input = input
    end

    def render(context)
      input_split = split_params(@input)
      page_url = context.environments.first["page"]["url"].downcase.chomp.split("/")
      return page_url[1] == input_split[0] ? ' ' + input_split[1] : ''
    end

    def split_params(params)
      params.split("|")
    end
  end
end

Liquid::Template.register_tag('active_url', Jekyll::ActiveUrl)
