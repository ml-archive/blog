module Jekyll
  class ActiveGroup < Liquid::Tag
    def initialize(tag_name, input, tokens)
      super
      @input = input
    end

    def render(context)
      input_split = split_params(@input)
      return context.environments.first["page"]["group"] == input_split[0] ? ' ' + input_split[1] : ''
    end

    def split_params(params)
      params.split("|")
    end
  end
end

Liquid::Template.register_tag('active_group', Jekyll::ActiveGroup)
