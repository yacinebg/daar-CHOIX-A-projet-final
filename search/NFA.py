"nous avons essayé de reprendre le code du premier projet qui était en java et l'avons mis en python, "
"mais ça servait à rien étant donné qu'il y'avait deja une laibrairie qui faisait ça"

# from .RegExTree import ALTERN, CONCAT, ETOILE

# class NFA:
#     def __init__(self, num_states):
#         self.transitions = [[] for _ in range(num_states)]
#         self.final_states = set()

#     def add_transition(self, parent, child, symbol):
#         self.transitions[parent].append([symbol, child])

#     def add_final_state(self, state):
#         self.final_states.add(state)

#     @staticmethod
#     def fusion(result, automate, offset):
#         for state_index, state_transitions in enumerate(automate.transitions):
#             for transition in state_transitions:
#                 symbol, target = transition
#                 result.add_transition(state_index + offset, target + offset, symbol)

#     @staticmethod
#     def build(tree):
#         if not tree.subTrees:
#             return NFA.build_leaf(tree.root)

#         if tree.root == ALTERN:
#             return NFA.altern_automate(tree)
#         if tree.root == CONCAT:
#             return NFA.concat_automate(tree)
#         if tree.root == ETOILE:
#             return NFA.etoile_automate(tree)

#         raise Exception("Erreur : symbole inconnu")

#     @staticmethod
#     def build_leaf(symbol):
#         nfa = NFA(2)
#         nfa.add_transition(0, 1, symbol)
#         nfa.add_final_state(1)
#         return nfa

#     @staticmethod
#     def concat_automate(tree):
#         left = NFA.build(tree.subTrees[0])
#         right = NFA.build(tree.subTrees[1])
#         res = NFA(len(left.transitions) + len(right.transitions))
#         NFA.fusion(res, left, 0)
#         res.add_transition(len(left.transitions) - 1, len(left.transitions), -1)
#         NFA.fusion(res, right, len(left.transitions))
#         res.add_final_state(len(left.transitions) + len(right.transitions) - 1)
#         return res

#     @staticmethod
#     def altern_automate(tree):
#         left = NFA.build(tree.subTrees[0])
#         right = NFA.build(tree.subTrees[1])
#         res = NFA(len(left.transitions) + len(right.transitions) + 2)
#         res.add_transition(0, 1, -1)
#         res.add_transition(0, len(left.transitions) + 1, -1)
#         NFA.fusion(res, left, 1)
#         NFA.fusion(res, right, len(left.transitions) + 1)
#         res.add_transition(len(left.transitions), len(res.transitions) - 1, -1)
#         res.add_transition(len(res.transitions) - 2, len(res.transitions) - 1, -1)
#         res.add_final_state(len(res.transitions) - 1)
#         return res

#     @staticmethod
#     def etoile_automate(tree):
#         star = NFA.build(tree.subTrees[0])
#         nfa = NFA(len(star.transitions) + 2)
#         nfa.add_transition(0, 1, -1)
#         nfa.add_transition(0, len(star.transitions) + 1, -1)
#         NFA.fusion(nfa, star, 1)
#         nfa.add_transition(len(star.transitions), 1, -1)
#         nfa.add_transition(len(star.transitions), len(star.transitions) + 1, -1)
#         nfa.add_final_state(len(star.transitions) + 1)
#         return nfa

