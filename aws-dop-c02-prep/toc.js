// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded affix "><a href="about.html">About</a></li><li class="chapter-item expanded "><a href="background.html"><strong aria-hidden="true">1.</strong> Background</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="devops_and_cloud.html"><strong aria-hidden="true">1.1.</strong> DevOps and cloud</a></li><li class="chapter-item expanded "><a href="osi_model.html"><strong aria-hidden="true">1.2.</strong> OSI Model</a></li><li class="chapter-item expanded "><a href="containers.html"><strong aria-hidden="true">1.3.</strong> Containers</a></li></ol></li><li class="chapter-item expanded "><a href="iam.html"><strong aria-hidden="true">2.</strong> IAM</a></li><li class="chapter-item expanded "><a href="aws_organisations.html"><strong aria-hidden="true">3.</strong> AWS organisations</a></li><li class="chapter-item expanded "><a href="storage.html"><strong aria-hidden="true">4.</strong> AWS Storage</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="elastic_block_storage.html"><strong aria-hidden="true">4.1.</strong> Elastic Block Storage</a></li><li class="chapter-item expanded "><a href="s3_misc.html"><strong aria-hidden="true">4.2.</strong> S3 misc.</a></li><li class="chapter-item expanded "><a href="dynamodb.html"><strong aria-hidden="true">4.3.</strong> DynamoDB</a></li></ol></li><li class="chapter-item expanded "><a href="load_balancers.html"><strong aria-hidden="true">5.</strong> Elastic Load Balancing</a></li><li class="chapter-item expanded "><a href="cloudformation.html"><strong aria-hidden="true">6.</strong> Cloudformation</a></li><li class="chapter-item expanded "><a href="elastic_beanstalk.html"><strong aria-hidden="true">7.</strong> Elasic Beanstalk</a></li><li class="chapter-item expanded "><a href="lambda.html"><strong aria-hidden="true">8.</strong> Lambda</a></li><li class="chapter-item expanded "><a href="step_functions.html"><strong aria-hidden="true">9.</strong> Step Functions</a></li><li class="chapter-item expanded "><a href="sns_and_sqs.html"><strong aria-hidden="true">10.</strong> SNS and SQS</a></li><li class="chapter-item expanded "><a href="ecs.html"><strong aria-hidden="true">11.</strong> Elastic Container Service</a></li><li class="chapter-item expanded "><a href="api_gateway.html"><strong aria-hidden="true">12.</strong> API Gateway</a></li><li class="chapter-item expanded "><a href="aws_opsworks.html"><strong aria-hidden="true">13.</strong> AWS OpsWorks</a></li><li class="chapter-item expanded "><a href="credentials_and_secrets.html"><strong aria-hidden="true">14.</strong> Credentials and Secrets</a></li><li class="chapter-item expanded "><a href="advanced_identity_and_permissions.html"><strong aria-hidden="true">15.</strong> Advanced Identity and Permissions</a></li><li class="chapter-item expanded "><a href="route53.html"><strong aria-hidden="true">16.</strong> Route53</a></li><li class="chapter-item expanded "><a href="kms.html"><strong aria-hidden="true">17.</strong> Key Management Service</a></li><li class="chapter-item expanded "><a href="efs.html"><strong aria-hidden="true">18.</strong> Elastic File System</a></li><li class="chapter-item expanded "><a href="cdn.html"><strong aria-hidden="true">19.</strong> Content Delivery Network</a></li><li class="chapter-item expanded "><a href="sdlc_automation.html"><strong aria-hidden="true">20.</strong> SDLC Automation</a></li><li class="chapter-item expanded "><a href="cloudwatch.html"><strong aria-hidden="true">21.</strong> CloudWatch</a></li><li class="chapter-item expanded "><a href="kinesis.html"><strong aria-hidden="true">22.</strong> Kinesis</a></li><li class="chapter-item expanded "><a href="security_misc.html"><strong aria-hidden="true">23.</strong> Security misc</a></li><li class="chapter-item expanded "><a href="disaster_recovery.html"><strong aria-hidden="true">24.</strong> Disaster Recovery</a></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString().split("#")[0].split("?")[0];
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);
