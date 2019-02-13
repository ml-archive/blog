module Jekyll
  module DaySuffixFilter
    # Adds st, nd, rd and th (ordinal) suffix to a number
    # Usage: {{ day | suffix }}
    def suffix(day)
      suffix = 'th'
      case day
      when '1', '21', '31'
        suffix = 'st'
      when '2', '22'
        suffix = 'nd'
      when '3', '23'
        suffix = 'rd'
      end
      day.to_s + suffix
    end
  end
end
Liquid::Template.register_filter(Jekyll::DaySuffixFilter)
