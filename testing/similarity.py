from difflib import SequenceMatcher

def similarity(a, b) :

    if a in b :
        return 1.0
    return SequenceMatcher(None, a, b).ratio()


variables = ['mass', 'length', 'height', 'gravity', 'angle angle', 'angular velocity']
plot_variables = variables.copy() + ['potential', 'kinetic', 'over time']

def get_plot_variables(phrase) :

    vars = plot_variables

    max_sim = 0.0
    output1 = ""
    for v in vars :
        sim = similarity(v, phrase)
        if sim > max_sim :
            max_sim = sim
            output1 = v

    vars.remove(output1)

    max_sim = 0.0
    output2 = ""
    for v in vars :
        sim = similarity(v, phrase)
        if sim > max_sim :
            max_sim = sim
            output2 = v

    vars.append(output1)

    if output1 == 'over time' :
        output1 = 'time'
    elif output2 == 'over time' :
        output2 = 'time'

    if output1 == 'angle angle' :
        output1 = 'angle'
    elif output2 == 'angle angle' :
        output2 = 'angle'

    if output1 == 'time' :
        output1, output2 = output2, 'time'
    
    return [output1, output2]


def main() :

    phrases = [
        ("plot potential vs kinetic energy", "potential", "kinetic")
    ]

    total_cases = len(phrases)
    failures = []

    for phrase in phrases :
        result = get_plot_variables(phrase[0])
        if result[0] != phrase[1] or result[1] != phrase[2] :
            failures.append([phrase, result, [phrase[1], phrase[2]]])

    print(total_cases - len(failures), "cases out of", total_cases, "passed.")

    for failure in failures :

        print("----")
        print("Phrase:", failure[0])
        print("Result:", failure[1])
        print("Expected:", failure[2])

main()