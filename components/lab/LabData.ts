import { LabConfig } from './LabTypes';

export const LAB_CONFIGS: Record<string, LabConfig> = {
    'sim_ai_neural': {
        id: 'sim_ai_neural',
        title: 'AI & Neural Networks Lab',
        theme: 'cyan',
        modules: [
            {
                id: 'neural_net',
                title: 'Neural Networks',
                description: 'Understanding how artificial neurons mimic the human brain to process information.',
                analogy: 'Like a team of students passing notes to solve a puzzle together.',
                icon: 'Brain',
                animationType: 'neural_network',
                animationSteps: [
                    { time: 0, label: 'input', text: 'Data enters the Input Layer.', microcopy: 'Raw data input.' },
                    { time: 3, label: 'hidden', text: 'Hidden layers process features and patterns.', microcopy: 'Finding patterns...' },
                    { time: 6, label: 'weights', text: 'Connections strengthen based on importance (weights).', microcopy: 'Learning what matters.' },
                    { time: 9, label: 'output', text: 'The network makes a prediction in the Output Layer.', microcopy: 'Prediction made!' },
                    { time: 12, label: 'learning', text: 'Feedback adjusts the weights to improve accuracy.', microcopy: 'Learning from mistakes.' },
                ],
                keyPoints: [
                    { title: 'Layers', description: 'Input, Hidden, and Output layers work together.' },
                    { title: 'Weights', description: 'Determines the importance of each connection.' },
                    { title: 'Training', description: 'The process of feeding data to improve accuracy.' },
                ],
                quiz: {
                    question: 'What happens in the "Hidden Layer"?',
                    options: ['Data is deleted', 'Patterns are processed', 'The final answer is printed', 'Nothing happens'],
                    correctAnswer: 'Patterns are processed',
                    explanation: 'The hidden layer is where the "magic" happens – identifying features and patterns in the data.',
                },
                miniSim: {
                    description: 'Train the network to recognize a cat. What data do you feed it?',
                    options: [
                        { id: 'a', text: 'Audio files of dogs.', isCorrect: false },
                        { id: 'b', text: 'Thousands of labeled cat photos.', isCorrect: true },
                        { id: 'c', text: 'Random numbers.', isCorrect: false },
                    ],
                    feedback: {
                        correct: 'Perfect! Supervised learning needs labeled examples.',
                        incorrect: 'Garbage in, garbage out. You need relevant data to train the model.',
                    },
                },
                funFact: 'Some neural networks have billions of parameters, making them incredibly complex.',
                badge: 'Brain Builder',
            },
            {
                id: 'machine_learning',
                title: 'Machine Learning types',
                description: 'Different ways computers learn from data without explicit programming.',
                analogy: 'Like learning to ride a bike (trial and error) vs. learning from a textbook (supervised).',
                icon: 'Cpu',
                animationType: 'process_flow',
                animationSteps: [
                    { time: 0, label: 'supervised', text: 'Supervised Learning: Learning with labeled examples (Teacher).', microcopy: 'Teacher guides the learning.' },
                    { time: 3, label: 'unsupervised', text: 'Unsupervised Learning: Finding patterns in chaos (Explorer).', microcopy: 'Finding hidden structure.' },
                    { time: 6, label: 'reinforcement', text: 'Reinforcement Learning: Learning through rewards and penalties (Gamer).', microcopy: 'Trial and error.' },
                    { time: 9, label: 'model', text: 'The algorithm builds a model based on the chosen method.', microcopy: 'Model created.' },
                    { time: 12, label: 'prediction', text: 'New data is fed in to test the model\'s predictions.', microcopy: 'Testing the system.' },
                ],
                keyPoints: [
                    { title: 'Supervised', description: 'Input and output are known (Labeled data).' },
                    { title: 'Unsupervised', description: 'Finding hidden patterns in unlabeled data.' },
                    { title: 'Reinforcement', description: 'Learning by interacting with an environment.' },
                ],
                quiz: {
                    question: 'Which type of learning is like training a dog with treats?',
                    options: ['Supervised', 'Unsupervised', 'Reinforcement Learning', 'Deep Learning'],
                    correctAnswer: 'Reinforcement Learning',
                    explanation: 'Just like giving a treat for good behavior, Reinforcement Learning uses rewards to encourage correct actions.',
                },
                miniSim: {
                    description: 'You want an AI to play a video game. Which method works best?',
                    options: [
                        { id: 'a', text: 'Show it spreadsheets.', isCorrect: false },
                        { id: 'b', text: 'Reinforcement Learning (Reward high scores).', isCorrect: true },
                        { id: 'c', text: 'Unsupervised sorting.', isCorrect: false },
                    ],
                    feedback: {
                        correct: 'Yes! Games are perfect for trial-and-error learning with rewards.',
                        incorrect: 'Static data won\'t help it react to a dynamic game environment.',
                    },
                },
                funFact: 'AlphaGo used Reinforcement Learning to beat the world champion at the game of Go.',
                badge: 'ML Master',
            },
        ]
    },
    'sim_finance_budget': {
        id: 'sim_finance_budget',
        title: 'Financial Future Lab',
        theme: 'green',
        modules: [
            {
                id: 'compound_interest',
                title: 'Compound Interest',
                description: 'The snowball effect of money earning money over time.',
                analogy: 'Like rolling a snowball down a hill – it gets bigger and bigger!',
                icon: 'TrendingUp',
                animationType: 'growth_chart',
                animationSteps: [
                    { time: 0, label: 'deposit', text: 'You deposit $100 (Principal).', microcopy: 'Initial investment.' },
                    { time: 3, label: 'year1', text: 'Year 1: You earn 10% interest ($10). Total: $110.', microcopy: 'Money is growing.' },
                    { time: 6, label: 'year2', text: 'Year 2: You earn 10% on $110 ($11). Total: $121.', microcopy: 'Interest earning interest!' },
                    { time: 9, label: 'growth', text: 'Over time, the growth accelerates rapidly.', microcopy: 'Exponential growth.' },
                    { time: 12, label: 'result', text: 'Your money has doubled without you doing any extra work!', microcopy: 'Wealth generated.' },
                ],
                keyPoints: [
                    { title: 'Start Early', description: 'Time is your best friend in compounding.' },
                    { title: 'Reinvest', description: 'Let your earnings generate their own earnings.' },
                    { title: 'Patience', description: 'The biggest gains happen in the later years.' },
                ],
                quiz: {
                    question: 'Why is compound interest better than simple interest?',
                    options: ['It is easier to calculate', 'You earn interest on your interest', 'Bankers like it more', 'It is tax-free'],
                    correctAnswer: 'You earn interest on your interest',
                    explanation: 'Simple interest only pays on the principal. Compound interest pays on the principal PLUS previously earned interest.',
                },
                miniSim: {
                    description: 'You have $1000. Option A: 5% simple interest. Option B: 4% compound interest. Which wins after 20 years?',
                    options: [
                        { id: 'a', text: 'Option A (5% Simple)', isCorrect: false },
                        { id: 'b', text: 'Option B (4% Compound)', isCorrect: true },
                    ],
                    feedback: {
                        correct: 'Correct! Even with a lower rate, compounding usually wins over long periods.',
                        incorrect: 'Surprisingly, no. The "interest on interest" effect makes Option B stronger in the long run.',
                    },
                },
                funFact: 'Einstein reportedly called compound interest the "eighth wonder of the world".',
                badge: 'Wealth Wizard',
            },
            {
                id: 'budgeting',
                title: 'The 50/30/20 Rule',
                description: 'A simple framework for managing your income effectively.',
                analogy: 'Slicing a pizza: Half for hunger (needs), some for taste (wants), and saving a slice for later.',
                icon: 'PieChart',
                animationType: 'budget_pie',
                animationSteps: [
                    { time: 0, label: 'income', text: 'Total Monthly Income comes in.', microcopy: 'Payday!' },
                    { time: 3, label: 'needs', text: '50% goes to Needs (Rent, Food, Utilities).', microcopy: 'The Essentials.' },
                    { time: 6, label: 'wants', text: '30% goes to Wants (Entertainment, Dining out).', microcopy: 'The Fun Stuff.' },
                    { time: 9, label: 'savings', text: '20% goes to Savings & Debt Repayment.', microcopy: 'Future You.' },
                    { time: 12, label: 'balance', text: 'A balanced budget leads to financial peace of mind.', microcopy: 'Financial Stability.' },
                ],
                keyPoints: [
                    { title: 'Needs (50%)', description: 'Start here. These are non-negotiable survival costs.' },
                    { title: 'Wants (30%)', description: 'Lifestyle choices and fun.' },
                    { title: 'Savings (20%)', description: 'The most important part for building wealth.' },
                ],
                quiz: {
                    question: 'Where should "Netflix Subscription" go in the 50/30/20 rule?',
                    options: ['Needs (50%)', 'Wants (30%)', 'Savings (20%)', 'It is free'],
                    correctAnswer: 'Wants (30%)',
                    explanation: 'Entertainment is a "Want". You can survive without it (technically!).',
                },
                miniSim: {
                    description: 'Your rent went up and now equals 60% of your income. What should you adjust?',
                    options: [
                        { id: 'a', text: 'Stop saving completely.', isCorrect: false },
                        { id: 'b', text: 'Reduce "Wants" to compensate.', isCorrect: true },
                        { id: 'c', text: 'Borrow money.', isCorrect: false },
                    ],
                    feedback: {
                        correct: 'Smart move. Temporary sacrifices in "Wants" keep your budget balanced without hurting your future savings.',
                        incorrect: 'Never sacrifice savings if you can avoid it. Cut from the "Fun" budget first.',
                    },
                },
                funFact: 'The 50/30/20 rule was popularized by Senator Elizabeth Warren in her book "All Your Worth".',
                badge: 'Budget Boss',
            },
        ]
    },
    'sim_blockchain_hash': {
        id: 'sim_blockchain_hash',
        title: 'Blockchain & Crypto Lab',
        theme: 'amber',
        modules: [
            {
                id: 'hashing',
                title: 'Cryptographic Hashing',
                description: 'The digital fingerprint that secures data on the blockchain.',
                analogy: 'Like a magical blender that turns any fruit into a unique juice, but you can\'t turn the juice back into fruit.',
                icon: 'Hash',
                animationType: 'hashing',
                animationSteps: [
                    { time: 0, label: 'input', text: 'Data (like a transaction) is sent to the hashing algorithm.', microcopy: 'Raw Data.' },
                    { time: 3, label: 'process', text: 'The algorithm scrambles the data using math.', microcopy: 'Crunching numbers...' },
                    { time: 6, label: 'output', text: 'A unique fixed-length string (Hash) is produced.', microcopy: 'Unique fingerprint.' },
                    { time: 9, label: 'change', text: 'Changing even one detailed letter in the input changes the WHOLE hash.', microcopy: 'Tamper evident!' },
                    { time: 12, label: 'security', text: 'This ensures data integrity—no one can tamper without it being obvious.', microcopy: 'Data is secure.' },
                ],
                keyPoints: [
                    { title: 'One-Way', description: 'Easy to create, impossible to reverse.' },
                    { title: 'Unique', description: 'Every input creates a completely different output.' },
                    { title: 'Deterministic', description: 'The same input always produces the exact same hash.' },
                ],
                quiz: {
                    question: 'If you change one letter in a document, what happens to its hash?',
                    options: ['It stays the same', 'It changes slightly', 'It changes completely', 'It is deleted'],
                    correctAnswer: 'It changes completely',
                    explanation: 'This "avalanche effect" is key to security. Any tampering is immediately obvious.',
                },
                miniSim: {
                    description: 'You want to verify a file hasn\'t been hacked. What do you compare?',
                    options: [
                        { id: 'a', text: 'The file size.', isCorrect: false },
                        { id: 'b', text: 'The file name.', isCorrect: false },
                        { id: 'c', text: 'The cryptographic hash.', isCorrect: true },
                    ],
                    feedback: {
                        correct: 'Correct! The hash is the only mathematically code-proof way to verify data integrity.',
                        incorrect: 'Spoofing size or name is easy. Spoofing a hash is mathematically impossible.',
                    },
                },
                funFact: 'Bitcoin uses the SHA-256 hashing algorithm.',
                badge: 'Hash Hero',
            },
        ]
    },
    'sim_iot_smart': {
        id: 'sim_iot_smart',
        title: 'IoT & Smart Cities Lab',
        theme: 'blue',
        modules: [
            {
                id: 'sensors',
                title: 'Sensors & Data Collection',
                description: 'How devices "feel" the world around them.',
                analogy: 'Like digital eyes and ears for a computer.',
                icon: 'Wifi',
                animationType: 'iot_sensor',
                animationSteps: [
                    { time: 0, label: 'environment', text: 'The environment changes (Temperature rises).', microcopy: 'It\'s getting hot.' },
                    { time: 3, label: 'detect', text: 'A sensor detects this change.', microcopy: 'Sensor activated.' },
                    { time: 6, label: 'convert', text: 'Analog signal is converted to digital data.', microcopy: 'Converting to data...' },
                    { time: 9, label: 'transmit', text: 'Data is sent to the Cloud via Wi-Fi.', microcopy: 'Sending to cloud.' },
                    { time: 12, label: 'action', text: 'The Smart AC turns on automatically.', microcopy: 'Action taken!' },
                ],
                keyPoints: [
                    { title: 'Input', description: 'Sensors gather data (light, heat, motion).' },
                    { title: 'Connectivity', description: 'Sending data to be processed.' },
                    { title: 'Automation', description: 'Machines acting on data without human help.' },
                ],
                quiz: {
                    question: 'Which of these is an IoT device?',
                    options: ['A regular hammer', 'A smart thermostat', 'A printed book', 'A generic rock'],
                    correctAnswer: 'A smart thermostat',
                    explanation: 'It collects data (temperature) and communicates over the internet to automate climate control.',
                },
                miniSim: {
                    description: 'Design a Smart Farm. What sensor do you need to water plants automatically?',
                    options: [
                        { id: 'a', text: 'Motion sensor.', isCorrect: false },
                        { id: 'b', text: 'Soil Moisture sensor.', isCorrect: true },
                        { id: 'c', text: 'Noise sensor.', isCorrect: false },
                    ],
                    feedback: {
                        correct: 'Perfect! When the soil is dry, the sensor triggers the sprinklers.',
                        incorrect: 'That won\'t help knowing when they are thirsty!',
                    },
                },
                funFact: 'There are more connected IoT devices on Earth than there are humans!',
                badge: 'IoT Innovator',
            },
        ]
    },
};
