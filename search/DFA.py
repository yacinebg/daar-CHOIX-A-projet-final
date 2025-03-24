"nous avons essayé de reprendre le code du premier projet qui était en java et l'avons mis en python, "
"mais ça servait à rien étant donné qu'il y'avait deja une librairie qui faisait ça"

# import os
# import subprocess
# from collections import deque, defaultdict

# class DFA:
#     def __init__(self, nfa):
#         self.transitions = []
#         self.final_states = set()
#         self._nfa_to_dfa(nfa)

#     def add_transition(self, parent, symbol, child):
#         while len(self.transitions) <= parent:
#             self.transitions.append({})
#         self.transitions[parent][symbol] = child

#     def add_final_state(self, state):
#         self.final_states.add(state)

#     def _nfa_to_dfa(self, nfa):
#         states_map = {}
#         queue = deque()

#         initial_state = self._epsilon_closure(nfa, {0})
#         states_map[frozenset(initial_state)] = 0
#         queue.append(initial_state)

#         while queue:
#             current = queue.popleft()
#             dfa_state = states_map[frozenset(current)]

#             symbol_targets = defaultdict(set)
#             for state in current:
#                 for symbol, target in nfa.transitions[state]:
#                     if symbol != -1:
#                         symbol_targets[symbol].add(target)

#             for symbol, targets in symbol_targets.items():
#                 closure = self._epsilon_closure(nfa, targets)
#                 closure_key = frozenset(closure)

#                 if closure_key not in states_map:
#                     states_map[closure_key] = len(states_map)
#                     queue.append(closure)

#                 self.add_transition(dfa_state, symbol, states_map[closure_key])

#         for nfa_states, dfa_state in states_map.items():
#             if any(len(nfa.transitions[s]) == 0 for s in nfa_states):
#                 self.add_final_state(dfa_state)

#     def _epsilon_closure(self, nfa, states):
#         closure = set(states)
#         stack = list(states)

#         while stack:
#             state = stack.pop()
#             for symbol, target in nfa.transitions[state]:
#                 if symbol == -1 and target not in closure:
#                     closure.add(target)
#                     stack.append(target)

#         return closure

#     def accept(self, string):
#         state = 0
#         transitioned = False

#         for char in string:
#             symbol = ord(char)
#             if state < len(self.transitions) and symbol in self.transitions[state]:
#                 state = self.transitions[state][symbol]
#                 transitioned = True
#             else:
#                 return transitioned and (state in self.final_states)

#         return state in self.final_states and transitioned

#     def to_dot_file(self, filename):
#         os.makedirs("dotfile", exist_ok=True)
#         filepath = os.path.join("dotfile", filename)

#         with open(filepath, 'w') as f:
#             f.write("digraph DFA {\n")

#             for final_state in self.final_states:
#                 f.write(f"    {final_state} [shape=doublecircle];\n")

#             for state, transitions in enumerate(self.transitions):
#                 for symbol, target in transitions.items():
#                     f.write(f"    {state} -> {target} [label=\"{chr(symbol)}\"];\n")

#             f.write("}\n")

#         self._convert_dot_to_png(filepath)

#     def _convert_dot_to_png(self, dotfile):
#         os.makedirs("schema", exist_ok=True)
#         pngfile = dotfile.replace("dotfile", "schema").replace(".dot", ".png")

#         try:
#             subprocess.run(["dot", "-Tpng", dotfile, "-o", pngfile], check=True)
#         except Exception as e:
#             print(f"Erreur conversion dot->png: {e}")
