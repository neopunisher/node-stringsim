exports.soundex = function (str) {
    // http://kevin.vanzonneveld.net
    // +   original by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
    // +    tweaked by: Jack
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: Onno Marsman
    // +      input by: Brett Zamir (http://brett-zamir.me)
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   original by: Arnout Kazemier (http://www.3rd-Eden.com)
    // +    revised by: Rafał Kukawski (http://blog.kukawski.pl)
    // *     example 1: soundex('Kevin');
    // *     returns 1: 'K150'
    // *     example 2: soundex('Ellery');
    // *     returns 2: 'E460'
    // *     example 3: soundex('Euler');
    // *     returns 3: 'E460'
    str = (str + '').toUpperCase();
    if (!str) {
        return '';
    }
    var sdx = [0, 0, 0, 0],
        m = {
            B: 1,
            F: 1,
            P: 1,
            V: 1,
            C: 2,
            G: 2,
            J: 2,
            K: 2,
            Q: 2,
            S: 2,
            X: 2,
            Z: 2,
            D: 3,
            T: 3,
            L: 4,
            M: 5,
            N: 5,
            R: 6
        },
        i = 0,
        j, s = 0,
        c, p;

    while ((c = str.charAt(i++)) && s < 4) {
        if (j = m[c]) {
            if (j !== p) {
                sdx[s++] = p = j;
            }
        } else {
            s += i === 1;
            p = 0;
        }
    }

    sdx[0] = str.charAt(0);
    return sdx.join('');
}

exports.levenshtein = function (s1, s2) {
    // http://kevin.vanzonneveld.net
    // +            original by: Carlos R. L. Rodrigues (http://www.jsfromhell.com)
    // +            bugfixed by: Onno Marsman
    // +             revised by: Andrea Giammarchi (http://webreflection.blogspot.com)
    // + reimplemented by: Brett Zamir (http://brett-zamir.me)
    // + reimplemented by: Alexander M Beedie
    // *                example 1: levenshtein('Kevin van Zonneveld', 'Kevin van Sommeveld');
    // *                returns 1: 3
    if (s1 == s2) {
        return 0;
    }

    var s1_len = s1.length;
    var s2_len = s2.length;
    if (s1_len === 0) {
        return s2_len;
    }
    if (s2_len === 0) {
        return s1_len;
    }

    // BEGIN STATIC
    var split = false;
    try {
        split = !('0')[0];
    } catch (e) {
        split = true; // Earlier IE may not support access by string index
    }
    // END STATIC
    if (split) {
        s1 = s1.split('');
        s2 = s2.split('');
    }

    var v0 = new Array(s1_len + 1);
    var v1 = new Array(s1_len + 1);

    var s1_idx = 0,
        s2_idx = 0,
        cost = 0;
    for (s1_idx = 0; s1_idx < s1_len + 1; s1_idx++) {
        v0[s1_idx] = s1_idx;
    }
    var char_s1 = '',
        char_s2 = '';
    for (s2_idx = 1; s2_idx <= s2_len; s2_idx++) {
        v1[0] = s2_idx;
        char_s2 = s2[s2_idx - 1];

        for (s1_idx = 0; s1_idx < s1_len; s1_idx++) {
            char_s1 = s1[s1_idx];
            cost = (char_s1 == char_s2) ? 0 : 1;
            var m_min = v0[s1_idx + 1] + 1;
            var b = v1[s1_idx] + 1;
            var c = v0[s1_idx] + cost;
            if (b < m_min) {
                m_min = b;
            }
            if (c < m_min) {
                m_min = c;
            }
            v1[s1_idx + 1] = m_min;
        }
        var v_tmp = v0;
        v0 = v1;
        v1 = v_tmp;
    }
    return v0[s1_len];
}

exports.similar_text = function (first, second) {
    // http://kevin.vanzonneveld.net
    // +   original by: Rafał Kukawski (http://blog.kukawski.pl)
    // +   bugfixed by: Chris McMacken
    // *     example 1: similar_text('Hello World!', 'Hello phpjs!');
    // *     returns 1: 7
    // *     example 2: similar_text('Hello World!', null);
    // *     returns 2: 0
    if (first === null || second === null || typeof first === 'undefined' || typeof second === 'undefined') {
        return 0;
    }

    first += '';
    second += '';

    var pos1 = 0,
        pos2 = 0,
        max = 0,
        firstLength = first.length,
        secondLength = second.length,
        p, q, l, sum;

    max = 0;

    for (p = 0; p < firstLength; p++) {
        for (q = 0; q < secondLength; q++) {
            for (l = 0;
            (p + l < firstLength) && (q + l < secondLength) && (first.charAt(p + l) === second.charAt(q + l)); l++);
            if (l > max) {
                max = l;
                pos1 = p;
                pos2 = q;
            }
        }
    }

    sum = max;

    if (sum) {
        if (pos1 && pos2) {
            sum += this.similar_text(first.substr(0, pos2), second.substr(0, pos2));
        }

        if ((pos1 + max < firstLength) && (pos2 + max < secondLength)) {
            sum += this.similar_text(first.substr(pos1 + max, firstLength - pos1 - max), second.substr(pos2 + max, secondLength - pos2 - max));
        }
    }

    return sum;
}

exports.metaphone = function(word, phones) {
    // +   original by: Greg Frazier
    // +   improved by: Brett Zamir (http://brett-zamir.me)
    // +   improved by: Rafał Kukawski (http://kukawski.pl)
    // *     example 1: metaphone('Gnu');
    // *     returns 1: 'N'
    
    word = (word == null ? '' : word + '').toUpperCase();
    
    function isVowel (a) {
        return 'AEIOU'.indexOf(a) !== -1;
    }
    
    function removeDuplicates (word) {
        var wordlength = word.length,
            char1 = word.charAt(0),
            char2,
            rebuilt = char1;
            
        for (var i = 1; i < wordlength; i++) {
            char2 = word.charAt(i);
            
            if (char2 !== char1 || char2 === 'C' || char2 === 'G') { // 'c' and 'g' are exceptions
                rebuilt += char2;
            }
            char1 = char2;
        }
        
        return rebuilt;
    }
    
    word = removeDuplicates(word);

    var wordlength = word.length,
        x = 0,
        metaword = '';

    //Special wh- case
    if (word.substr(0, 2) === 'WH') {
        // Remove "h" and rebuild the string
        word = 'W' + word.substr(2);
    }
    
    var cc = word.charAt(0); // current char. Short name cause it's used all over the function
    var pc = ''; // previous char. There is none when x === 0
    var nc = word.charAt(1); // next char
    var nnc = ''; // 2 characters ahead. Needed later
    
    if (1 <= wordlength) {
        switch (cc) {
        case 'A':
            if (nc === 'E') {
                metaword += 'E';
            } else {
                metaword += 'A';
            }
            x += 1;
            break;
        case 'E': case 'I': case 'O': case 'U':
            metaword += cc;
            x += 1;
            break;
        case 'G': case 'K': case 'P':
            if (nc === 'N') {
                x += 1;
            }
            break;
        case 'W':
            if (nc === 'R') {
                x += 1;
            }
            break;
        }
    }

    for (; x < wordlength; x++) {
        cc = word.charAt(x);
        pc = word.charAt(x - 1);
        nc = word.charAt(x + 1);
        nnc = word.charAt(x + 2);
        
        if (!isVowel(cc)) {
            switch (cc) {
            case 'B':
                if (pc !== 'M') {
                    metaword += 'B';
                }
                break;
            case 'C':
                if (x + 1 <= wordlength) {
                    if (word.substr(x - 1, 3) !== 'SCH') {
                        if (x === 0 && (x + 2 <= wordlength) && isVowel(nnc)) {
                            metaword += 'K';
                        } else {
                            metaword += 'X';
                        }
                    } else if (word.substr(x + 1, 2) === 'IA') {
                        metaword += 'X';
                    } else if ('IEY'.indexOf(nc) !== -1) {
                        if (x > 0) {
                            if (pc !== 'S') {
                                metaword += 'S';
                            }
                        } else {
                            metaword += 'S';
                        }
                    } else {
                        metaword += 'K';
                    }
                } else {
                    metaword += 'K';
                }
                break;
            case 'D':
                if (x + 2 <= wordlength && nc === 'G' && 'EIY'.indexOf(nnc) !== -1) {
                    metaword += 'J';
                    x += 2;
                } else {
                    metaword += 'T';
                }
                break;
            case 'F':
                metaword += 'F';
                break;
            case 'G':
                if (x < wordlength) {
                    if ((nc === 'N' && x + 1 === wordlength - 1) || (nc === 'N' && nnc === 'S' && x + 2 === wordlength - 1)) {
                        break;
                    }
                    if (word.substr(x + 1, 3) === 'NED' && x + 3 === wordlength - 1) {
                        break;
                    }
                    if (word.substr(x - 2, 3) === 'ING' && x === wordlength - 1) {
                        break;
                    }
                    
                    if (x + 1 <= wordlength - 1 && word.substr(x - 2, 4) === 'OUGH') {
                        metaword += 'F';
                        break;
                    }
                    if (nc === 'H' && x + 2 <= wordlength) {
                        if (isVowel(nnc)) {
                            metaword += 'K';
                        }
                    } else if (x + 1 === wordlength) {
                        if (nc !== 'N') {
                            metaword += 'K';
                        }
                    } else if (x + 3 === wordlength) {
                        if (word.substr(x + 1, 3) !== 'NED') {
                            metaword += 'K';
                        }
                    } else if (x + 1 <= wordlength) {
                        if ('EIY'.indexOf(nc) !== -1) {
                            if (pc != 'G') {
                                metaword += 'J';
                            }
                        } else if (x === 0 || pc !== 'D' || 'EIY'.indexOf(nc) === -1) {
                            metaword += 'K';
                        }
                    } else {
                        metaword += 'K';
                    }
                } else {
                    metaword += 'K';
                }
                break;
            case 'M': case 'J': case 'N': case 'R': case 'L':
                metaword += cc;
                break;
            case 'Q':
                metaword += 'K';
                break;
            case 'V':
                metaword += 'F';
                break;
            case 'Z':
                metaword += 'S';
                break;
            case 'X':
                metaword += (x === 0) ? 'S' : 'KS';
                break;
            case 'K':
                if (x === 0 || pc !== 'C') {
                    metaword += 'K';
                }
                break;
            case 'P':
                if (x + 1 <= wordlength && nc === 'H') {
                    metaword += 'F';
                } else {
                    metaword += 'P';
                }
                break;
            case 'Y':
                if (x + 1 > wordlength || isVowel(nc)) {
                    metaword += 'Y';
                }
                break;
            case 'H':
                if (x === 0 || 'CSPTG'.indexOf(pc) === -1) {
                    if (isVowel(nc) === true) {
                        metaword += 'H';
                    }
                }
                break;
            case 'S':
                if (x + 1 <= wordlength) {
                    if (nc === 'H') {
                        metaword += 'X';
                    } else if (x + 2 <= wordlength && nc === 'I' && 'AO'.indexOf(nnc) !== -1) {
                        metaword += 'X';
                    } else {
                        metaword += 'S';
                    }
                } else {
                    metaword += 'S';
                }
                break;
            case 'T':
                if (x + 1 <= wordlength) {
                    if (nc === 'H') {
                        metaword += '0';
                    } else if (x + 2 <= wordlength && nc === 'I' && 'AO'.indexOf(nnc) !== -1) {
                        metaword += 'X';
                    } else {
                        metaword += 'T';
                    }
                } else {
                    metaword += 'T';
                }
                break;
            case 'W':
                if (x + 1 <= wordlength && isVowel(nc)) {
                    metaword += 'W';
                }
                break;
            }
        }
    }

    phones = parseInt(phones, 10);
    if (metaword.length > phones) {
        return metaword.substr(0, phones);
    }
    return metaword;
}
