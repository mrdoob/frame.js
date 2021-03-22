/**
 * @author mrdoob / http://mrdoob.com/
 */

import { UIDiv, UIPanel, UISpan, UIText } from './libs/ui.js';

import { SidebarAnimation } from './SidebarAnimation.js';
import { SidebarProject } from './SidebarProject.js'
import { SidebarRender } from './SidebarRender.js'

function Sidebar( editor ) {

	var container = new UIPanel();
	container.setId( 'sidebar' );

	//

	var animationTab = new UIText( 'ANIMATION' ).onClick( onClick );
	var projectTab = new UIText( 'PROJECT' ).onClick( onClick );
	var renderTab = new UIText( 'RENDER' ).onClick( onClick );

	var tabs = new UIDiv();
	tabs.setId( 'tabs' );
	tabs.add( animationTab, projectTab, renderTab );
	container.add( tabs );

	function onClick( event ) {

		select( event.target.textContent );

	}

	//

	var animation = new UISpan().add(
		new SidebarAnimation( editor )
	);
	container.add( animation );

	var project = new UISpan().add(
		new SidebarProject( editor )
	);
	container.add( project );

	var render = new UISpan().add(
		new SidebarRender( editor )
	);
	container.add( render );

	//

	function select( section ) {

		animationTab.setClass( '' );
		projectTab.setClass( '' );
		renderTab.setClass( '' );

		animation.setDisplay( 'none' );
		project.setDisplay( 'none' );
		render.setDisplay( 'none' );

		switch ( section ) {
			case 'ANIMATION':
				animationTab.setClass( 'selected' );
				animation.setDisplay( '' );
				break;
			case 'PROJECT':
				projectTab.setClass( 'selected' );
				project.setDisplay( '' );
				break;
			case 'RENDER':
				renderTab.setClass( 'selected' );
				render.setDisplay( '' );
				break;
		}

	}

	select( 'ANIMATION' );

	return container;

}

export { Sidebar };
