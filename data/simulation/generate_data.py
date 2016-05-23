# generate simulated csv file for data
# each row represents a voter
import random
import csv

# constant variables
states = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho', 'Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine' 'Maryland','Massachusetts','Michigan','Minnesota','Mississippi', 'Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio', 'Oklahoma','Oregon','Pennsylvania','Rhode Island','South  Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming', 'Puerto Rico', 'District of Columbia']

parties = ['Democrat', 'Republican']
candidates = ['Candidate X', 'Candidate Y']

# current fields...
# id = identification number
# state = state of voter
# party = aligned party
# candidate = voted for this candidate

# returns array of voters given amount of voters
def generateData(numVoters):
	voters = [['id', 'state', 'party', 'candidate']]
	for n in range(0, numVoters):
		voter = []

		voter.append(n)
		voter.append(random.choice(states))
		voter.append(random.choice(parties))
		voter.append(random.choice(candidates))

		voters.append(voter)

	return voters

def main():
	with open('testData.csv', 'w', newline='') as file:
		writer = csv.writer(file, delimiter=',')

		writer.writerows(generateData(1000))

main()