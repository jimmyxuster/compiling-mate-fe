pipeline {
    agent {
        docker {
            image 'node:8.11.1'
            args '-p 3500:3000'
        }
    }
    environment { 
        CI = 'true'
    }
    stages {
        stage('Build') {
            steps {
                sh 'npm install'
                sh 'npm build'
            }
        }
        stage('Test') {
            steps {
                sh 'echo test'
            }
        }
        stage('Deliver') { 
            steps {
                sh 'echo deliver' 
            }
        }
    }
}