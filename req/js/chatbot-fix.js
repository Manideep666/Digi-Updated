console.log('✨ chatbot-fix.js loaded (Manideep local assistant)');

// ===== AI CHATBOT FUNCTIONALITY - CORRECTED =====
function initializeChatbot() {
    console.log('🤖 Initializing AI Chatbot...');
    
    const chatBtn = document.getElementById('chatBtn');
    const chatPopup = document.getElementById('chatPopup');
    const closeChat = document.getElementById('closeChat');
    const sendMessage = document.getElementById('sendMessage');
    const userMessage = document.getElementById('userMessage');
    const chatMessages = document.getElementById('chatMessages');
    
    if (!chatBtn || !chatPopup) {
        console.log('⚠️ Chat elements not found');
        return;
    }
    
    console.log('✅ Chat elements found:', { chatBtn: !!chatBtn, chatPopup: !!chatPopup });
    
    let isOpen = false;
    
    // Toggle chat popup
    chatBtn.addEventListener('click', () => {
        isOpen = !isOpen;
        if (isOpen) {
            chatPopup.classList.add('active');
            // show down-arrow icon
            chatBtn.classList.add('active');
            const openIcon = chatBtn.querySelector('.close-icon');
            const closedIcon = chatBtn.querySelector('.chat-icon');
            if (openIcon && closedIcon) {
                closedIcon.style.display = 'none';
                openIcon.style.display = 'block';
            }
            
            // Lock body scroll (fallback for browsers without :has support)
            document.body.classList.add('chat-open');

            // Add welcome message if no messages exist
            if (chatMessages && !chatMessages.querySelector('.chat-message')) {
                addWelcomeMessage();
            }
        } else {
            chatPopup.classList.remove('active');
            chatBtn.classList.remove('active');
            const openIcon = chatBtn.querySelector('.close-icon');
            const closedIcon = chatBtn.querySelector('.chat-icon');
            if (openIcon && closedIcon) {
                closedIcon.style.display = 'block';
                openIcon.style.display = 'none';
            }
            // Unlock body scroll
            document.body.classList.remove('chat-open');
        }
    });
    
    // Close chat
    if (closeChat) {
        closeChat.addEventListener('click', () => {
            isOpen = false;
            chatPopup.classList.remove('active');
            chatBtn.classList.remove('active');
            const openIcon = chatBtn.querySelector('.close-icon');
            const closedIcon = chatBtn.querySelector('.chat-icon');
            if (openIcon && closedIcon) {
                closedIcon.style.display = 'block';
                openIcon.style.display = 'none';
            }
            document.body.classList.remove('chat-open');
        });
    }
    
    // Handle suggestion chips
    document.addEventListener('click', (e) => {
        const chip = e.target.closest('.suggestion-chip');
        if (chip) {
            const message = chip.getAttribute('data-text') || chip.textContent;
            if (userMessage) {
                userMessage.value = message;
            }
            hideSuggestions();
            handleSendMessage();
        }
    });
      // Send message function
    async function handleSendMessage() {
        const message = userMessage?.value?.trim();
        console.log('handleSendMessage called, message:', message);
        
        if (!message) {
            console.log('No message to send');
            return;
        }
        
        // Add user message
        console.log('Adding user message');
        addChatMessage(message, 'user');
        userMessage.value = '';
        hideSuggestions();
        
        // Show typing indicator
        console.log('Showing typing indicator');
        showTypingIndicator();
        
        try {
            await new Promise(r => setTimeout(r, 400));
            hideTypingIndicator();
            const botResponse = manideepAssistantReply(message);
            addChatMessage(botResponse, 'bot');
            setTimeout(() => {
                const cm = document.getElementById('chatMessages');
                if (cm) cm.scrollTop = cm.scrollHeight;
            }, 0);
            showSuggestions();
        } catch (error) {
            console.error('Error:', error);
            hideTypingIndicator();
            addChatMessage('Something went wrong. Use the Contact section to reach Manideep directly.', 'bot');
            showSuggestions();
        }
    }
    
    // Send message on button click
    if (sendMessage) {
        sendMessage.addEventListener('click', handleSendMessage);
    }
    
    // Send message on Enter key
    if (userMessage) {
        userMessage.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleSendMessage();
            }
        });
    }
}

// Add welcome message
function addWelcomeMessage() {
    const welcomeMsg = `Hi! I'm Manideep's portfolio assistant. I answer only from Manideep Pekety's resume and portfolio details. Ask about his experience, skills, projects, education, certifications, or contact details.`;
    addChatMessage(welcomeMsg, 'bot');
    
    // Ensure persistent bottom suggestions bar
    const suggestions = [
        "Professional summary",
        "Skills and tools",
        "Work experience",
        "Contact details"
    ];
    ensurePersistentSuggestions(suggestions);
}

// Add chat message
function addChatMessage(message, sender) {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) {
        console.error('chatMessages element not found');
        return;
    }
    
    console.log('Adding message:', message, 'Sender:', sender);
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}`;
    
    if (sender === 'bot') {
        messageDiv.innerHTML = `
            <div class="bot-avatar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.96 9.96 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/>
                    <circle cx="9" cy="9" r="1"/>
                    <circle cx="15" cy="9" r="1"/>
                    <path d="M8 13a8 8 0 008 0"/>
                </svg>
            </div>
            <div class="message-content">${message}</div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div class="message-content">${message}</div>
        `;
    }
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    console.log('Message added successfully');
}

// Add suggestion chips
function addSuggestionChips(suggestions) {
    // Deprecated in favor of persistent bar; keep as no-op to avoid duplicates
}

// Create/refresh a persistent suggestions dock inside messages area
function ensurePersistentSuggestions(suggestions){
    const chatMessages = document.getElementById('chatMessages');
    if(!chatMessages) return;
    let dock = document.getElementById('suggestionsDock');
    if(!dock){
        dock = document.createElement('div');
        dock.id = 'suggestionsDock';
        dock.className = 'suggestions-dock';
        chatMessages.appendChild(dock);
    }
    if(dock.childElementCount === 0){
        const bar = document.createElement('div');
        bar.className = 'persistent-suggestions';
        suggestions.forEach(text=>{
            const chip = document.createElement('button');
            chip.className = 'suggestion-chip';
            chip.type = 'button';
            chip.textContent = text;
            bar.appendChild(chip);
        });
        dock.appendChild(bar);
    }
}

function hideSuggestions(){
    const dock = document.getElementById('suggestionsDock');
    if(dock){ dock.remove(); }
}

function showSuggestions(){
    // Rebuild suggestions dock at the end of messages
    ensurePersistentSuggestions([
        "Professional summary",
        "Skills and tools",
        "Work experience",
        "Contact details"
    ]);
    const chatMessages = document.getElementById('chatMessages');
    if(chatMessages){ chatMessages.scrollTop = chatMessages.scrollHeight; }
}

// Show typing indicator
function showTypingIndicator() {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;
    
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-message bot typing';
    typingDiv.id = 'typing-indicator';
    
    typingDiv.innerHTML = `
        <div class="bot-avatar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.96 9.96 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/>
                <circle cx="9" cy="9" r="1"/>
                <circle cx="15" cy="9" r="1"/>
                <path d="M8 13a8 8 0 008 0"/>
            </svg>
        </div>
        <div class="typing-dots">
            <span></span>
            <span></span>
            <span></span>
        </div>
    `;
    
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Hide typing indicator
function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

/** Local answers from Manideep's resume (no external API). */
function manideepAssistantReply(userMessage) {
    const m = (userMessage || '').toLowerCase();

    const resumeData = {
        name: 'Manideep Pekety',
        role: 'DevOps Engineer',
        summary: 'DevOps Engineer with 3+ years of experience in AWS and GCP cloud infrastructure, CI/CD automation, Docker-based workflows, Terraform IaC, Linux administration, monitoring, logging, and security.',
        contact: 'Phone: 6300978091 | Email: manideep.pekety6@gmail.com | Location: Hyderabad, India | LinkedIn is available in the Contact section.',
        experience: 'Netenrich, Hyderabad (September 2023 - Present): Terraform-based AWS/GCP provisioning, Jenkins+Git+Maven CI/CD, Docker containerization, Kubernetes on EKS/GKE, blue-green and canary deployments, Prometheus/Grafana/New Relic monitoring, ELK stack, Trivy and SonarQube security scanning, and Git branching collaboration.',
        cloud: 'AWS: EC2, S3, VPC, IAM, ASG, EKS, CloudWatch, RDS MySQL. GCP: Compute Engine, GKE, Cloud Run, Cloud Functions, Cloud Run Jobs, Pub/Sub.',
        tools: 'Git, GitHub, Maven, Jenkins, AWS CodePipeline, Docker, Kubernetes, Terraform, Argo CD, Argo Workflows, Kafka, Prometheus, Grafana, Datadog, New Relic, Site24x7, OpsRamp, ELK, SonarQube, Trivy, OWASP, Bash, Python, Linux, Ubuntu.',
        education: 'B.Tech in Computer Science and Engineering, Aditya College of Engineering, Surampalem (2019-2023).',
        certifications: 'AWS Certified Cloud Practitioner, Microsoft Certified: Azure AI Fundamentals, APSSDC Python Programming Certification, NDG Linux Unhatched Certification.',
        project: 'Worked on Resolution Intelligence Cloud and portfolio implementations using Cloud Run, Cloud Functions, Pub/Sub, and Kafka-based event-driven patterns.'
    };

    if (/hello|hi\b|hey|start/.test(m)) {
        return `Hello! I can share details about ${resumeData.name}'s experience, skills, projects, education, certifications, and contact details.`;
    }
    if (/name|who are you|about manideep|about him|profile|summary|introduction/.test(m)) {
        return `${resumeData.name} is a ${resumeData.role}. ${resumeData.summary}`;
    }
    if (/experience|work|job|netenrich|career|role|current company/.test(m)) {
        return resumeData.experience;
    }
    if (/skill|tech|tool|stack|terraform|jenkins|docker|kubernetes|k8s|argo|monitor|logging|security/.test(m)) {
        return `Core skills and tools: ${resumeData.tools}`;
    }
    if (/aws|gcp|cloud|pub\/sub|compute engine|eks|gke|cloud run|cloud functions|rds|vpc|iam/.test(m)) {
        return resumeData.cloud;
    }
    if (/project|portfolio|resolution intelligence cloud|implementation|deployment/.test(m)) {
        return resumeData.project;
    }
    if (/education|degree|college|b\.tech|university/.test(m)) {
        return resumeData.education;
    }
    if (/certification|credential|badge|aws certified|azure|apssdc|ndg/.test(m)) {
        return resumeData.certifications;
    }
    if (/contact|email|phone|linkedin|hire|reach|location|hyderabad/.test(m)) {
        return resumeData.contact;
    }
    if (/award|recognition|achievement/.test(m)) {
        return 'Awards and recognitions are listed in the Awards section of this portfolio.';
    }

    return `I answer only using ${resumeData.name}'s resume and portfolio details. Ask about summary, skills, experience, projects, certifications, education, or contact information.`;
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeChatbot();
});
