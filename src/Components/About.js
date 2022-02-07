import React from 'react'

const About = () => {
    const projectDetail = "The motivation behind the project is that people’s purchasing decisions nowadays are easily influenced by social media testimonials about the specific products sold by the vendors. Companies would also like to build a strong brand image by providing timely customer service and tracking comments about their products through social media. Therefore, our group decided to set our focus on providing the general customer reviews on a well-known brand by tracking its Twitter data. In this case, we picked Domino’s Pizza because they are known for their utilization of social media accounts."
	

  return (
    <div>
        <header class="masthead bg-primary text-white text-center">
        <section class="page-section bg-primary text-white mb-0" id="about">
            <div class="container">
                
                <h2 class="page-section-heading text-center text-uppercase text-white">About The Project</h2>
                
                <div class="divider-custom divider-light">
                    <div class="divider-custom-line"></div>
                    <div class="divider-custom-icon"><i class="fas fa-star"></i></div>
                    <div class="divider-custom-line"></div>
                </div>
                
                <div class="divider-custom">
                    <div class="col-lg-6 justify-content-center">
                        <p class="lead justify-content-center"> {projectDetail} </p>
                    </div>
                </div>
            </div>
        </section>


        
        <section class="page-section" id="contact">
            <div class="container">
                
                <h2 class="page-section-heading text-center text-uppercase text-white mb-0">Contact Us</h2>
                
                <div class="divider-custom divider-light">
                    <div class="divider-custom-line"></div>
                    <div class="divider-custom-icon"><i class="fas fa-star"></i></div>
                    <div class="divider-custom-line"></div>
                </div>
                <div class="divider-custom"></div>
                    <p>Selina Lin :    qinghaol@usc.edu</p>
                    <p>Yingning Fan :    yingning@usc.edu</p>
                    <p>Wangying Yang :   wyang890@usc.edu</p>
            </div>
        </section>
        </header>
    </div>
  )
}

export default About