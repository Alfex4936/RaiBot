module.exports = {
    
    checkDays: function(date) {
        let now = new Date();
        let diff = now.getTime() - date.getTime();
        let days = Math.floor(diff / 86400000);
        return days + (days == 1 ? ' day' : ' days') + ' ago';
    },

    duration: function(ms) {
        let sec = Math.floor((ms / 1000) % 60).toString()
        let min = Math.floor((ms / (1000 * 60)) % 60).toString()
        let hrs = Math.floor((ms / (1000 * 60 * 60)) %60).toString()
        let days = Math.floor((ms / (1000 * 60 * 60 * 24)) % 60).toString()
        return `${days.padStart(1, `0`)} days, ${hrs.padStart(2, `0`)} hours, ${min.padStart(2, `0`)} minutes, ${sec.padStart(2, `0`)} seconds.`
    },

    contains: function(target, pattern) {
        var value = 0;
        pattern.forEach(function(word){
          value = value + target.includes(word);
        });
        return (value === 1)
    },

    pad: function(value, length) {
        return value + ' '.repeat(length - value.toString().length);
    },

    emojify: function(str) {
        if (typeof str === 'string') {
            return Array.prototype.map.call(str, (e, i, a) => {
                if (/[a-zA-Z]/.test(e)) {
                    return ':regional_indicator_' + e.toLowerCase() + ':'
                } else {
                    return e;
                }
            }).join(' ');
        }
    },

    capitalizeFirst: function(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
    }

}