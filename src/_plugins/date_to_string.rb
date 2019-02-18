module Jekyll
  module DateToOFormatFilter
    # Adds st, nd, rd and th (ordinal) suffix to a number
    # Usage: {{ post.date | date_format }}
    def date_to_string(date)
      if date != nil
        parsed = date.strftime("%B %-d %Y").split(" ")
        day = parsed[1]
        parsed[0].to_s + '&nbsp;' + suffix(day) + '&nbsp;' + parsed[2].to_s
      end
    end
  end
end
Liquid::Template.register_filter(Jekyll::DateToOFormatFilter)
