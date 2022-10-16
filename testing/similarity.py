from difflib import SequenceMatcher

def similarity(a, b) :

    return SequenceMatcher(None, a, b).ratio()


def main() :

    pass


main()