from difflib import SequenceMatcher

def similarity(a, b) :

    return SequenceMatcher(None, a, b).ratio()


def main() :

    phrase = 'Plot kinetic energy over angle'

    print(similarity(phrase, 'angle angle'))
    print(similarity(phrase, 'potential'))


main()